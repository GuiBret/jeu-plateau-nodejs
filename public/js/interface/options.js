var options;

$.get(`../getoptions/${sessionStorage.getItem("id")}`, function(result) {
    options = result;
    $("#check-animations").prop("checked", options.animations);
    $("#slider-volume").val(options.volume * 100);
    $("#span-volume").html(options.volume * 100);
    console.log($("#span-volume"));
});

$(document).ready(function() {
    
    
   
    /* Slider's span value update */
    $("#slider-volume").on("input", function(e) {
        let volume_val = $(e.target).val();
        $("#span-volume").html(volume_val);
    });
    
    /* "Set as default" button */
    $("#btn-default").on("click", function() {
        /* Animations */
        $("#check-animations").prop("checked", options.animations);
        
        let volume_val = options.volume * 100; // The stored value is in range 0 <= val <= 1 to make it easier to pass to Howler (which requires values in that range)
        /* Volume */
        $("#slider-volume").val(options.volume * 100);
        $("#span-volume").html(options.volume * 100);
    });
    
    $("#btn-quit").on("click", function(e) {
        
        e.preventDefault();
        window.location.replace("../../menu/");
    });
    
    $("#btn-save").on("click", function(e) {
        e.preventDefault();
        let volume_val = parseFloat($("#slider-volume").val() / 100),
            animations_val = ($("#check-animations").prop("checked")) ? 1 : 0; // To get an integer value and pass it to SQL easily
        let options = {"volume": volume_val, "animations": animations_val, "joueur_concerne": parseInt(sessionStorage.getItem("id"))};
        
        
        /* We update the options values in the sessionStorage */
        sessionStorage.setItem("volume", volume_val);
        sessionStorage.setItem("animations", animations_val);
        //console
        if(sessionStorage.getItem("id") !== -1) { // If the user is not a guest, we send the options to the database
            console.log("Sending data to db");
            alert("Meuh");
            $.ajax({ /* Sending a POST request to the server so that it updates the database with the new values */
                type: "POST",
                data:JSON.stringify(options),
                contentType: "application/json",
                url: "/jeuplateau/sendoptions/"
            });    
        }
        
        
        window.location.replace("../menu/");
        
    });
});

