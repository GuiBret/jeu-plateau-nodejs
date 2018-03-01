/*
  Contains generic functions, not meant to be directly used by the game, but called by functions which have a direct access to it

*/


/* Creates a modal with Bootstrap which will require only one button (access to restricted page, game finished, etc) */
function createModalDialog(info, callback) {
    let dialog = $(`<div class='modal fade' id='modalDialog'><div class='modal-dialog' role='document'><div class='modal-content'><div class='modal-header'><h5 class='title'>${info.title}</h5></div><div class='modal-body'>${info.content}</div><div class='modal-footer mx-auto'><button type="button" class="btn btn-primary" id='btn-ok'>OK</button></div></div></div></div>`);


    $("body").append(dialog);

    $("#btn-ok").on("click", callback);


    dialog.modal("show");

}
// Creates a modal with Bootstrap which will require 2 buttons (for example, surrender request)
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
