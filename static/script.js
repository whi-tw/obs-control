var socket = io.connect(
  "http://" + document.domain + ":" + location.port + "/obs"
);
var noSleep = new NoSleep();

socket.on("current scene", function(msg) {
  $("h4")
    .filter(function() {
      return $(this).text() === msg.name;
    })
    .closest(".card")
    .addClass("bg-success");

  $("h4")
    .filter(function() {
      return $(this).text() !== msg.name;
    })
    .closest(".card")
    .removeClass("bg-success");
});

function change_scene(name) {
  socket.emit("change scene", { name: name });
}

socket.on("current webcam", function(webcam) {
  $("button")
    .filter("[id^=Webcam]")
    .removeClass("btn-success")
    .addClass("btn-secondary");
  $("#Webcam" + webcam.name)
    .addClass("btn-success")
    .removeClass("btn-secondary");
});
function change_webcam(name) {
  socket.emit("change webcam", { name: name });
}

$(document).ready(function() {
  document.addEventListener("fullscreenchange", function() {
    if (!document.fullscreen) {
      noSleep.disable();
    }
  });
  if (!document.fullscreen) {
    $("#fullScreenModal").modal();
  }
});

// $(document).onfullscreenchange(function(event) {
//   console.log(event);
//   noSleep.disable();
// });
