var socket = io.connect((window.location.hostname === "localhost") ? "http://localhost:5000" : `http://${window.location.hostname}:5000`);


if(sessionStorage.getItem("id") && sessionStorage.getItem("id") !== -1) { // If user credentials already are in the sessionstorage, we redirect the user to the main menu

        window.location.replace("menu/");
}

$("document").ready(function() {
    
    $("#username, #password").on("change paste keyup", listenerFormConnexion); // Disables the "Connection" button if any of username and password's value is empty
  
    $("#guest-button").on("click", defineGuestConnectionData); // Defines the sessionStorage's settings of a guest, then redirects to menu
    
    $("#connect-button").on("click", function(e) {
        e.preventDefault();
        let connectionInfo = {"username": $("#username").val(), "password": $("#password").val()};

        socket.emit("connectionRequest", connectionInfo);
        
        socket.on("connectionAccepted", function(userData) {
           let $dialog;
            
            if(userData.new_user) { // If we've had to create a new user
                $dialog = $(`<div id="confirmation_connection" title="Compte créé">Le compte ${userData["username"]} vient d'être créé avec succès.</div>`);
            } else { // If it's a normal connection
                $dialog = $(`<div id="confirmation_connection" title="Connexion réussie">Vous êtes désormais connecté en tant que ${userData["username"]}</div>`);
            }
           
            
            $dialog.dialog({
                modal:true,
                buttons: {
                    Ok: function() {
                        $(this).dialog("close");
                        
                        // Ajout des données dans la sessionStorage pour pouvoir les réutiliser par la suite
                        sessionStorage.setItem("username", userData.username);
                        sessionStorage.setItem("password", userData.password);
                        sessionStorage.setItem("id", userData.id);
                        
                        // Redirection vers le menu principal
                        
                        window.location.replace("menu/");
                    }
                }
            })
        });
        
        socket.on("wrongPassword", function() {
            
            if(!$("#wrong_password").length) { // Avoids creating more than 1 alert windo
                let $dialog = $(`<div id="wrong_password" title="Mot de passe incorrect">Vous avez entré un mauvais mot de passe, veuillez rééssayer.</div>`);

                $dialog.dialog({
                    modal:true,
                    buttons: {
                        Ok: function() {
                            $(this).dialog("close");

                        }
                    }
                });
            } else {
                $("#wrong_password").dialog("open");
            }
            
        });
    });
});


function listenerFormConnexion() {
    $("#connect-button").attr("disabled", $("#username").val() === "" || $("#password").val() === "");
}

function defineGuestConnectionData() {
    sessionStorage.setItem("username", "Invité");    
    sessionStorage.setItem("password", "");
    sessionStorage.setItem("id", "-1");
    window.location.replace("menu/");
}
