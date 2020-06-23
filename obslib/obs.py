import json
import re

from obswebsocket import obsws, requests, events


class OBSConnection:
    ws = None

    def __init__(self, switch_handler=None, webcam_handler=None):
        try:
            with open('.config.json', 'r') as cfg:
                config = json.load(cfg)
                self.ws = obsws(
                    host=config['host'], port=config['port'], password=config['password'])
                if switch_handler:
                    self.ws.register(switch_handler, events.SwitchScenes)
                if webcam_handler:
                    self.ws.register(
                        webcam_handler, events.SceneItemVisibilityChanged)
                self.ws.connect()
        except FileNotFoundError:
            print(".config.json not found")

    def current_scene(self):
        scene = self.ws.call(requests.GetCurrentScene()).getName()
        return scene

    def webcam_scene(self):
        scenes = self.scenes()
        return [
            scene for scene in scenes if scene["name"] == "Webcam"][0]

    def webcams(self):
        return self.webcam_scene()["sources"]

    def current_webcam(self):
        scenes = self.scenes()
        webcamScene = [
            scene for scene in scenes if scene["name"] == "Webcam"][0]
        webcam = [cam for cam in webcamScene["sources"] if cam["render"]][0]

        return webcam

    def scenes(self, hide_utils=True, hide_games=True):
        scenes = []
        for scene in self.ws.call(requests.GetSceneList()).getScenes():
            if hide_utils and scene["name"].endswith("[util]"):
                continue
            if hide_games and scene["name"].endswith("[game]"):
                continue
            scenes.append(scene)
        return scenes

    def set_scene(self, name):
        self.ws.call(requests.SetCurrentScene(name))

    def set_webcam(self, name):
        webcam_scene = self.webcam_scene()
        self.ws.call(requests.SetSceneItemRender(
            name, True, webcam_scene["name"]))
        for cam in self.webcams():
            if cam["name"] != name:
                self.ws.call(requests.SetSceneItemRender(
                    cam["name"], False, webcam_scene["name"]))

    def toggle_source(self, scene, source):
        state = self.ws.call(requests.GetSceneItemProperties(
            item=source, scene_name=scene)).getVisible()
        print(state)
        self.ws.call(requests.SetSceneItemRender(
            source=source, render=(not state)))
