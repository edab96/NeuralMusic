from flask import render_template, redirect, send_from_directory, flash
from app import app
from app.forms import TrainingSelection
from csv import writer
from datetime import datetime


def append_list_as_row(file_name, list_of_elem):
    # Open file in append mode
    with open(file_name, 'a+', newline='') as write_obj:
        # Create a writer object from csv module
        csv_writer = writer(write_obj)
        # Add contents of list as last row in the csv file
        csv_writer.writerow(list_of_elem)

def getKeysByValue(dictOfElements, valueToFind):
    listOfKeys = list()
    listOfItems = dictOfElements.items()
    for item  in listOfItems:
        if item[1] == valueToFind:
            listOfKeys.append(item[0])
    return  listOfKeys

@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')

@app.route('/model', methods=['GET', 'POST'])
def model():
    form = TrainingSelection()
    if form.is_submitted():

        selection = {
                    "Bach" : form.is_bach.data,
                    "Mozart" : form.is_mozart.data,
                    "Schubert" : form.is_schubert.data,
                    "Liszt" : form.is_liszt.data,
                    "Linkin Park": form.is_linkinpark.data,
                    }

        newrow = [datetime.now(), form.is_mozart.data, form.is_bach.data, form.is_schubert.data, form.is_liszt.data, form.is_linkinpark.data]
        append_list_as_row('app/requests/song_requests.csv', newrow)

        selected_artists = getKeysByValue(selection, True)
        if len(selected_artists) == 2:
            str_artists = " and ".join(selected_artists)
        else:
            str_artists = ", ".join(selected_artists)

        flash('Creating music based on {0}.  Request submitted at {1}.'.format(str_artists, newrow[0].strftime("%H:%M:%S")))

        return redirect('/result')
    return render_template('model.html', form=form, title="Make music!")


@app.route('/result', methods=['GET', 'POST'])
def result():
    return render_template('result.html', title="Your music is ready!")



@app.route('/player_svitlana', methods=['GET', 'POST'])
def player():
    return render_template('player_svitlana.html')