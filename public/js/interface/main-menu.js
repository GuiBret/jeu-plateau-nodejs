var socket = io.connect((window.location.hostname === "localhost") ? "http://localhost:5000" : `http://${window.location.hostname}:5000`);

$("document").ready(function() {

    verifClientConnecte(); // On vérifie si le client est connecté normalement ou en tant qu'invité, si aucun des deux, on affiche un dialog et le redirige vers la page de connexion


    /* Button tooltips requiring connection */
    $("#btn-options, #btn-profile").on("mouseover", function() {
        $(this).tooltip();
    })

    $("#btn-profile").tooltip();


    /* Button click management*/
    $(".button_container button").on("click", function(e) { // Listener unique pour tous les boutons, un switch dans le callback pour savoir quel bouton a été cliqué

       switch($(e.target).attr('id')) {
           case "btn-1v1-online": // 1v1 en ligne
               socket.emit("demandePartieOnline");

               $("#btn-1v1-online").html("Recherche en cours...");
               $("#btn-1v1-online").attr("disabled", "true");
               socket.on("onlineEnemyFound", function(params) {
                  window.location.replace(`../game/online?id=${ params["id"] }`);
               });
            break;
           case "btn-ia": // Duel contre l'IA

            break;
            case "btn-1v1-local": // 1v1 en local
               socket.emit("demandePartieLocale");
               socket.on("partieLocaleTrouvee", function(params) {
                  window.location.replace(`../game/local?id=${ params["id"] }`);
               });

            break;
            case "btn-options": // Bouton des options
               window.location.replace(`../options/`);
            break;
           case "btn-profile":
                window.location.replace(`../profile/${sessionStorage.getItem("id")}/`);
            break;
           case "btn-disconnect":
                handleDisconnect();
            break;
           default:
            break;
       }
    });
});

function verifClientConnecte() {
    if(!sessionStorage.getItem("username")) {

        let info = {"title": "pas de connexion",
                    "content": "Vous êtes sur la page d'accueil du jeu, mais vous n'êtes pas connecté. Vous allez automatiquement être redirigé vers la page de connexion"}
        createModalDialog(info, function() { window.location.replace("../"); });

    }
}

/* In case of a disconnection, we remove all session storage items and redirect the user back to the connection page */
function handleDisconnect() {
    sessionStorage.removeItem("id");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("password");


    window.location.replace("../");
}
