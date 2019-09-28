var options;

// We initially get the options from the server, and, when acquired, update the fields (player ID === -1 will return default values)
$.get(`../getoptions/${sessionStorage.getItem("id")}`, function(result) {
    options = result;
    setOptions();

});

$(document).ready(function() {
    "use strict";

    if(sessionStorage.getItem("id") == -1) { // if the user is connected as a guest, we add a warning message
        let $message = $("<p id='warning-message'>Note : Vous êtes connecté en tant qu'invité. Vos modifications seront donc uniquement effectives durant cette session.</p>");

        $message.insertBefore("#form_general_options");
    }

    /* Slider's span value update */
    $("#slider-volume").on("input", function(e) {
        let volume_val = $(e.target).val();
        $("#span-volume").html(volume_val);
    });

    $(".flag").on("click", function(e) {
        let selected_flag = $(e.target);

        if(!selected_flag.hasClass("current")) { // If the user clicks on a new flag, we apply the class current to the one that has been clicked
            $(".current").removeClass("current");
            selected_flag.addClass("current");
        }
    })

    /* "Set as default" button */
    $("#btn-default").on("click", function() {
        setOptions();
    });

    $("#btn-quit").on("click", function(e) {
        e.preventDefault();
        backToMenu();
    });

    $("#btn-save").on("click", function(e) {
        e.preventDefault();

        defineOptions();

        if(sessionStorage.getItem("id") !== -1) { // If the user is not a guest, we send the options to the database
            sendOptionsToServer();
        } else {
            backToMenu();
        }


    });
});

function backToMenu() {
    window.location.replace("../menu/");
}

function setOptions() { // Used when the page is loaded and onclick "set as default", defines values (options is a global variable, so we don't need it as parameter)
    $("#check-animations").prop("checked", options.animations);
    $("#slider-volume").val(options.volume * 100);
    $("#span-volume").html(options.volume * 100);

    $(`#${options.language}`).addClass("current");
}

function defineOptions() { // Defines the options in sessionStorage
    /* We update the options values in the sessionStorage */

    let volume_val = parseFloat($("#slider-volume").val() / 100),
            animations_val = ($("#check-animations").prop("checked")) ? 1 : 0, // To get an integer value and pass it to SQL easily
            language_val = $(".current").get(0).id;



    sessionStorage.setItem("volume", volume_val);
    sessionStorage.setItem("animations", animations_val);

    document.cookie = `locale=${language_val}; path=/;` // The language is stored in the cookie, so that it can be synchronized with the server


}

function sendOptionsToServer() {
    let language_val = document.querySelector(".current").id;

    let new_options = {"volume": sessionStorage.getItem("volume"), "animations": sessionStorage.getItem("animations"), "language": language_val, "joueur_concerne": parseInt(sessionStorage.getItem("id"))};
    console.log(new_options);
    $.ajax({ /* Sending a POST request to the server so that it updates the database with the new values */
                type: "POST",
                data:JSON.stringify(new_options),
                contentType: "application/json",
                url: "../sendoptions/"
    }).then(() => {
        backToMenu();
    });
}

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}
