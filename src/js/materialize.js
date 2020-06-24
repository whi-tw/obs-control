require("materialize-loader");

import { FormSelect } from "materialize-css";
import { Modal } from "materialize-css";

$(document).ready(function () {
  FormSelect.init($("select"));
  FormSelect.getInstance($("select"));
  Modal.init($("#fullScreenModal"));
  if (!document.fullscreen) {
    Modal.getInstance($("#fullScreenModal")).open();
  }
});
