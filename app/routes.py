from flask import render_template, redirect, send_from_directory, flash
from app import app
from datetime import datetime


#Model API dependencies
from flask import json, jsonify
from flask import request
from datetime import datetime
from .static.ai import generate as neuralMusic


@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')

@app.route('/favicon.ico')
def favicon():
    return app.send_static_file('favicon.ico')
    
# API Endpoint for MIDI generation
@app.route("/generate", methods=["GET"])
def generate():
    #nameOfTheCharacter = flask.request.args.get('name')
    now = datetime.now()
    artist = request.args.get('artist', default = '*', type = str)
    print("Querying model for", artist)
    generatedMidi = neuralMusic.generate(artist)
    midi = "LinkinPark 30-05-2020 122552.mid"
    #midi =  artist + " " + now.strftime("%d-%m-%Y %H%M%S") + ".mid"
    return jsonify(
                    {
                        "artist": artist,
                        "midi": generatedMidi
                    }
                )