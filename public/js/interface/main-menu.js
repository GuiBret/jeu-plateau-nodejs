var socket = io.connect((window.location.hostname === "localhost") ? "http://localhost:8080" : `http://${window.location.hostname}:5000`);

$("document").ready(function() {
    
    verifClientConnecte(); // On vérifie si le client est connecté normalement ou en tant qu'invité, si aucun des deux, on affiche un dialog et le redirige vers la page de connexion
    
    
    
    let username = sessionStorage.getItem("username");
    $("#username_label").html(username);
    
    
    
    /* Gestion clic boutons */
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
            break;
           case "btn-profile":
                window.location.replace(`../profile/${sessionStorage.getItem("id")}`);
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
        let dialog_text = {"title": "Vous n'êtes pas connecté", "content": "Vous êtes sur la page d'accueil du jeu, mais vous n'êtes pas connecté. Vous allez automatiquement être redirigé vers la page de connexion"};
        
        let $dialog = $(`<div id="user-not-connected" title="${dialog_text.title}">${dialog_text.content}</div>`);
        
        $dialog.dialog({
            modal:true,
            buttons: {
                Ok: function() {
                    $(this).dialog("close");
                    
                    window.location.replace("../");
                }
            }
        })
    }
}


function handleDisconnect() {
    sessionStorage.removeItem("id");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("password");
    
    window.location.replace("../");
}