from flask import Flask, render_template, jsonify, request
from flask_socketio import SocketIO, emit

from obslib import obs

app = Flask(__name__)
socketio = SocketIO(app)


def on_switch(event):
    socketio.emit('current scene', {
        'name': event.getSceneName()}, namespace="/obs")


def on_change_cam(event):
    if event.getSceneName() != "Webcam":
        pass
    if event.getItemVisible():
        socketio.emit('current webcam', {
            'name': event.getItemName()}, namespace="/obs")


obsconnection = obs.OBSConnection(on_switch, on_change_cam)


@app.route('/')
def index():
    return render_template('index.html', scenes=obsconnection.scenes(), webcams=obsconnection.webcams())


@app.route('/api/scenes')
def json_scenes():
    return jsonify(obsconnection.scenes())


@socketio.on('change scene', namespace='/obs')
def change_scene(message):
    scene_name = message['name']
    obsconnection.set_scene(scene_name)
    return ""


@socketio.on('change webcam', namespace='/obs')
def change_webcam(message):
    webcam_name = message['name']
    obsconnection.set_webcam(webcam_name)

    return ""


@socketio.on('connect', namespace='/obs')
def connection_init():
    emit('current scene', {
        'name': obsconnection.current_scene()}, namespace="/obs")
    emit('current webcam',
         obsconnection.current_webcam(), namespace="/obs")
