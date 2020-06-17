import sys
from os import path

#Settings
#artist = sys.argv[1]
#weights = sys.argv[2]

#if (not path.exists("artists/"+artist)):
#    print("\nNo folder found for this artist\n")
#    exit()
    
#if (not path.exists("artists/"+artist+"/"+weights)):
#    print("\nNo weights found for this artist.\nMake sure you specify the weights file name as a second parameter in CLI, or\nthat a weights.hdf5 file exists in the artist folder.\n")
#    exit()
    
weights = ""
notesFolder = ""


#Dependencies
from tensorflow.keras import backend
import tensorflow as tf
import glob
import pickle
import numpy
from music21 import converter, instrument, note, chord
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from tensorflow.keras.layers import Dropout
from tensorflow.keras.layers import LSTM
from tensorflow.keras.layers import Activation
from tensorflow.keras.layers import BatchNormalization as BatchNorm
from tensorflow.keras import utils as np_utils
from tensorflow.keras.callbacks import ModelCheckpoint

from music21 import instrument, note, stream, chord
from datetime import datetime


#The cool stuff

def generate(artist):
    weights = "app/static/ai/artists/"+artist+"/"+"weights.hdf5"
    notes = "app/static/ai/artists/"+artist+"/notes"

    """ Generate a piano midi file """
    #load the notes used to train the model
    with open(notes, 'rb') as filepath:
        notes = pickle.load(filepath)

    # Get all pitch names
    pitchnames = sorted(set(item for item in notes))
    # Get all pitch names
    n_vocab = len(set(notes))
    print("Instantiating model")
    network_input, normalized_input = prepare_sequences(notes, pitchnames, n_vocab)
    model = create_network(normalized_input, n_vocab, weights)
    print("Generating notes")
    prediction_output = generate_notes(model, network_input, pitchnames, n_vocab)
    print("Rebulding midi")
    midiPath = create_midi(prediction_output, artist)
    return midiPath

def prepare_sequences(notes, pitchnames, n_vocab):
    """ Prepare the sequences used by the Neural Network """
    # map between notes and integers and back
    note_to_int = dict((note, number) for number, note in enumerate(pitchnames))

    sequence_length = 100
    network_input = []
    output = []
    for i in range(0, len(notes) - sequence_length, 1):
        sequence_in = notes[i:i + sequence_length]
        sequence_out = notes[i + sequence_length]
        network_input.append([note_to_int[char] for char in sequence_in])
        output.append(note_to_int[sequence_out])

    n_patterns = len(network_input)

    # reshape the input into a format compatible with LSTM layers
    normalized_input = numpy.reshape(network_input, (n_patterns, sequence_length, 1))
    # normalize input
    normalized_input = normalized_input / float(n_vocab)    
    return (network_input, normalized_input)

def create_network(network_input, n_vocab, weights):
    """ create the structure of the neural network """
    model = Sequential()
    model.add(LSTM(
        512,
        input_shape=(network_input.shape[1], network_input.shape[2]),
        recurrent_dropout=0.3,
        return_sequences=True
    ))
    model.add(LSTM(512, return_sequences=True, recurrent_dropout=0.3,))
    model.add(LSTM(512))
    model.add(BatchNorm())
    model.add(Dropout(0.3))
    model.add(Dense(256))
    model.add(Activation('relu'))
    model.add(BatchNorm())
    model.add(Dropout(0.3))
    model.add(Dense(n_vocab))
    model.add(Activation('softmax'))
    model.compile(loss='categorical_crossentropy', optimizer='rmsprop')

    if (not path.exists(weights)):
        print("\nNo weights found for this artist.\nMake sure you specify the weights file name as a second parameter in CLI, or\nthat a weights.hdf5 file exists in the artist folder.\n")
        
        import os
        cwd = os.getcwd()
        print("current working folder",cwd)
        exit()

    model.load_weights(weights)

    return model

def generate_notes(model, network_input, pitchnames, n_vocab):
    """ Generate notes from the neural network based on a sequence of notes """
    # pick a random sequence from the input as a starting point for the prediction
    start = numpy.random.randint(0, len(network_input)-1)

    int_to_note = dict((number, note) for number, note in enumerate(pitchnames))

    pattern = network_input[start]
    prediction_output = []

    # generate 500 notes
    for note_index in range(100):
        prediction_input = numpy.reshape(pattern, (1, len(pattern), 1))
        prediction_input = prediction_input / float(n_vocab)

        prediction = model.predict(prediction_input, verbose=0)

        index = numpy.argmax(prediction)
        result = int_to_note[index]
        prediction_output.append(result)

        pattern.append(index)
        pattern = pattern[1:len(pattern)]

    return prediction_output

def create_midi(prediction_output, artist):
    """ convert the output from the prediction to notes and create a midi file
        from the notes """
    offset = 0
    output_notes = []

    # create note and chord objects based on the values generated by the model
    for pattern in prediction_output:
        # pattern is a chord
        if ('.' in pattern) or pattern.isdigit():
            notes_in_chord = pattern.split('.')
            notes = []
            for current_note in notes_in_chord:
                new_note = note.Note(int(current_note))
                new_note.storedInstrument = instrument.Piano()
                notes.append(new_note)
            new_chord = chord.Chord(notes)
            new_chord.offset = offset
            output_notes.append(new_chord)
        # pattern is a note
        else:
            new_note = note.Note(pattern)
            new_note.offset = offset
            new_note.storedInstrument = instrument.Piano()
            output_notes.append(new_note)

        # increase offset each iteration so that notes do not stack
        offset += 0.5

    midi_stream = stream.Stream(output_notes)

    now = datetime.now()
    midiPath = '/static/ai/output/'+ artist + " " + now.strftime("%d-%m-%Y %H%M%S") + '.mid'
    midi_stream.write('midi', fp = 'app'+midiPath)
    return midiPath


#if __name__ == '__main__':
#    generate()
