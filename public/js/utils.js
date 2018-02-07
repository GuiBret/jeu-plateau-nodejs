
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