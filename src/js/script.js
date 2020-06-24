import NoSleep from "nosleep.js";
import io from "socket.io-client";
import { FormSelect } from "materialize-css";

var socket = io.connect(
  "http://" + document.domain + ":" + location.port + "/obs"
);
var noSleep = new NoSleep();

socket.on("current scene", function (msg) {
  $(".card")
    .filter('div[data-scene-name="' + msg.name + '"]')
    .addClass("green");

  $(".card")
    .filter('div[data-scene-name!="' + msg.name + '"]')
    .removeClass("green");
});

socket.on("current webcam", function (webcam) {
  $("#camSelect").val(webcam.name);
  FormSelect.init($("#camSelect"));
});

$(document).ready(function () {
  $(".card").click(function () {
    var sceneName = $(this).data("scene-name");
    socket.emit("change scene", { name: sceneName });
  });
  $("#camSelect").change(function () {
    var selectedCam = $(this).children("option:selected").val();
    socket.emit("change webcam", { name: selectedCam });
  });
  $("#enableFullscreen").click(function () {
    document.body.requestFullscreen();
    noSleep.enable();
  });
  document.addEventListener("fullscreenchange", function () {
    if (!document.fullscreen) {
      noSleep.disable();
    }
  });
});
