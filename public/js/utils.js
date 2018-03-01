
/* Creates a modal with Material which will require only one button (access to restricted page, game finished, etc) */
function createModalDialog(info, callback) {
    let dialog = document.createElement("dialog");

    dialog.classList = "md1-dialog";

    dialog.innerHTML = `<h4 class='md1-dialog__title text-center'>${info.title}</h4><div class='md1-dialog__content'><p>${info.content}</p></div><div class="md1-dialog__actions text-center"><button type='button' class="mdl-button mdl-js-button mdl-button--raised back">OK</button></div>`;

    document.body.appendChild(dialog);

    $("button.back").on("click", callback);


    dialog.showModal();
    $(".mdl-button").blur();

}
// Creates a modal with Material which will require 2 buttons (for example, surrender request)
function createValidationDialog(info, callbackOK) {
  "use strict";

    if(!$("#modalDialog").length) {

      let dialog =`<div class='modal fade' id='modalDialog'><div class='modal-dialog' role='document'><div class='modal-content'><div class='modal-header'><h5 class='title'>${info.title}</h5></div><div class='modal-body'>${info.content}</div><div class='modal-footer'><button type="button" class="btn btn-secondary" data-dismiss="modal">Non</button><button type="button" class="btn btn-primary yes">Oui</button></div></div></div></div>`;

      $("body").append(dialog);

      $("button.yes").on("click", callbackOK);

      $("#btn-ok").on("click", callbackOK);

    }

    $("#modalDialog").modal("show");

}
