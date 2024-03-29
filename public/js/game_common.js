/* Contient les fonctions communes aux modes online et offline pour la gestion de partie */

/* Fonctions d'affichage  */

function resizeGrid() {
        if($(document).width() < 650) {
            var $width = $("table").width(), // Largeur du tableau de jeu
                $td_width = Math.trunc($width / 11), // On récupère la valeur la plus proche en-dessous (0.6px n'auraient aucun sens)
                $final_width = $td_width * 11; // On recalcule la taille finale du tableau

            $("table").css({"height":`${$final_width}px`, "width":`${$final_width}px`});
            $("td").css({"height":`${$td_width}px`, "width":`${$td_width}px`});
        }
}

function affichageFinPartieOnline(infos, joueur_actuel, sm) {
    let dialog_text;

    if(infos["winner"] === joueur_actuel.nom) {
        sm.playSound(["WIN"]);
        dialog_text = {"title": "Victoire ! " , "content": `Vous avez gagné en ${infos["turns"]} tours !`};
    } else {
        sm.playSound(["LOSE"]);
        dialog_text = {"title": "Défaite...", "content": `Vous avez perdu contre ${infos["winner"]} en ${infos["turns"]} tours...`};
    }

    afficherDialogFinPartie(dialog_text);
}

function affichageFinPartieOffline(infos) {

    let dialog_text= {"title": "Fin de partie", "content": `${infos["winner"]} a gagné en ${infos["turns"]} tours !`};

    afficherDialogFinPartie(dialog_text);

}

function afficherDialogFinPartie(dialog_text) {
    createModalDialog(dialog_text, function() { window.location.replace("../menu/")});

}
/* Fonctions utilitaires */

function isLocal() {
        return window.location.pathname.split("/").pop() === "local";
}

function getEnemy() {
    return joueurs[(id_joueur +1) % 2];
}

function resetPlayerPositions() {
        joueurs[0].position = grille.getPosJoueur(1); // On remet à jour la position des joueurs
        joueurs[1].position = grille.getPosJoueur(2);

}

function gestionCombatFront(callback) {
    $("#btn_defense, #btn_attaque").unbind("click");

    $("#boutons_combat").slideToggle(200, function() {
            this.remove();
    });
}

function weaponManagement(weapon) {

}
