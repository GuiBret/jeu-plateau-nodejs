var options;

$.get(`../getoptions/${sessionStorage.getItem("id")}`, function(result) {
    options = result;
    
    setOptions();
    
});

$(document).ready(function() {
    
    if(sessionStorage.getItem("id") == -1) { // if the user is connected as a guest, we add a warning message
        let $message = $("<p id='warning-message'>Note : Vous êtes connecté en tant qu'invité. Vos modifications seront donc uniquement effectives durant cette session.</p>");
        
        $message.insertBefore("#form_general_options");
    }
   
    /* Slider's span value update */
    $("#slider-volume").on("input", function(e) {
        let volume_val = $(e.target).val();
        $("#span-volume").html(volume_val);
    });
    
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
        }
    
        backToMenu();
        
    });
});

function backToMenu() {
    window.location.replace("../menu/");
}

function setOptions() { // Used when the page is loaded and onclick "set as default", defines values (options is a global variable, so we don't need it as parameter)
    $("#check-animations").prop("checked", options.animations);
    $("#slider-volume").val(options.volume * 100);
    $("#span-volume").html(options.volume * 100);
}

function defineOptions() { // Defines the options in sessionStorage
    /* We update the options values in the sessionStorage */
    
    let volume_val = parseFloat($("#slider-volume").val() / 100),
            animations_val = ($("#check-animations").prop("checked")) ? 1 : 0; // To get an integer value and pass it to SQL easily
    
    sessionStorage.setItem("volume", volume_val);
    sessionStorage.setItem("animations", animations_val);
}

function sendOptionsToServer() {
    let new_options = {"volume": sessionStorage.getItem("volume"), "animations": sessionStorage.getItem("animations"), "joueur_concerne": parseInt(sessionStorage.getItem("id"))};
    
    $.ajax({ /* Sending a POST request to the server so that it updates the database with the new values */
                type: "POST",
                data:JSON.stringify(new_options),
                contentType: "application/json",
                url: "/jeuplateau/sendoptions/"
    });  
}
