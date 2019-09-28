

var socket = io.connect(`http://${window.location.hostname}:5000`);


if(sessionStorage.getItem("id") && sessionStorage.getItem("id") !== -1) { // If user credentials already are in the sessionstorage, we redirect the user to the main menu

        window.location.replace("menu/");
}

$("document").ready(function() {

    $("#username, #password").on("change paste keyup", listenerFormConnexion); // Disables the "Connection" button if any of username and password's value is empty

    $("#guest-button").on("click", defineGuestConnectionData); // Defines the sessionStorage's settings of a guest, then redirects to menu

    $("#connect-button").on("click", (e) => {
        e.preventDefault();


        // Tries to detect the user's language based on window.navigator.language value

        let userLanguage = window.navigator.language || window.navigator.userLanguage,
            splitted_user_language = userLanguage.split(/[_-]/)[0].toLowerCase();

        console.log(splitted_user_language)
        let connectionInfo = {"username": $("#username").val(), "password": $("#password").val(), "language": splitted_user_language}; // The language will only be used in a user creation


        $.ajax({ /* Sending a POST request to the server which will get this user / create it and update the locale */
                    type: "POST",
                    data:JSON.stringify(connectionInfo),
                    contentType: "application/json",
                    url: "/jeuplateau/connect"
        }).then((userData) => {

            let $dialog;
            document.cookie = `locale=${userData.language}`; // We set the locale as a cookie so that the server gets it on each request
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
                         sessionStorage.setItem("id", userData.id);
                         sessionStorage.setItem("animations", userData.animations);
                         sessionStorage.setItem("volume", userData.volume);


 // -                        __.setLocale(userData.language);

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
    sessionStorage.setItem("username", __("Invité"));
    sessionStorage.setItem("id", "-1");
    sessionStorage.setItem("animations", 1);
    sessionStorage.setItem("volume", .5);
    sessionStorage.setItem("language", __.getLocale());

    window.location.replace("./menu/");
}
