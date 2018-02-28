
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
    let dialog = document.createElement("dialog");

    dialog.classList = "md1-dialog__actions";

     dialog.innerHTML = `<h4 class='md1-dialog__title text-center'>${info.title}</h4><div class='md1-dialog__content'><p>${info.content}</p></div><div class="md1-dialog__actions d-flex flex-row justify-content-around"><button type='button' id="btn-ok" class="mdl-button mdl-js-button mdl-button--raised yes">Oui</button><button type="button" id="btn-close" class="mdl-button mdl-js-button mdl-button--raised">Non</button></div>`;

    //dialogPolyfill.register(dialog);

    document.body.appendChild(dialog);

    $(".button.yes").on("click", callbackOK);



    $("#btn-close").on("click", () => { // If the user doesn't accept, we remove the decision
        "use strict";

        dialog.close();
        $("dialog").remove();

    });

    $("#btn-ok").on("click", callbackOK);

    dialog.showModal();

    $(".mdl-button").blur();

}
