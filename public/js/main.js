/*jshint esversion:6*/

/*globals $, Joueur, Interface, Grille */

var socket = io.connect((window.location.hostname === "localhost") ? "http://localhost:5001" : `http://${window.location.hostname}:5001`),
    sm = new SoundManager(),
    game_id,
    grille,
    joueurs,
    combat = false,
    joueur_actuel,
    interface_jeu,
    id_joueur,
    nom_joueur, // Variable provisoire (utilisée uniquement en online) servant à stocker le nom du joueur le temps qu'on récupère celui de l'ennemi
    tour_lance = false,
    local; // Booléan, self-explanatory 

$(document).ready(function () {

    "use strict";
    
    let gameID = new URL(window.location.href).searchParams.get("id");
    socket.emit("inscriptionRoom", gameID); // On inscrit le client à sa room pour faciliter les communcations
    
    local = isLocal();
    
    $(window).resize(resizeGrid); // Si la fenêtre est resizée, on redimensionnera la grille (fait au chargement de la grille pour les petits écrans de toute façon)
        
    
    
    if(!local) { // Partie online
        
        if(sessionStorage.getItem("username")) { // If the user is connected, we take his username
            nom_joueur = sessionStorage.getItem("username");
        } else {
            nom_joueur = prompt("Entrez votre nom : ");    
        }
        
        joueurs = [new Joueur(0, "Joueur 1"), new Joueur(1, "Joueur 2")]; // On définira les noms quand on recevra celui de l'ennemi

        interface_jeu = new Interface(joueurs[0], joueurs[1]);

        socket.emit("confirmationPartieOnline", {"id": gameID, "nom": nom_joueur});
        
        
    } else { // Partie locale
        
        game_id = gameID;

        var nom_j1 = prompt("Entrez le nom du joueur 1 : "),
            nom_j2 = prompt("Entrez le nom du joueur 2 : ");
            
        if(!nom_j1) {
            nom_j1 = "Joueur 1";
        }

        if(!nom_j2) {
            nom_j2 = "Joueur 2";
        }

        joueurs = [new Joueur(0, nom_j1), new Joueur(1, nom_j2)];

        interface_jeu = new Interface(joueurs[0], joueurs[1]);

        socket.emit("confirmationPartieLocale", {"id": gameID, "noms": [joueurs[0].nom, joueurs[1].nom]});
            
    }
    

    socket.on("envoiGrilleOnline", function(params) { // Params : player_id : id du joueur (1 ou 2, définit l'ordre), grille : le terrain de jeu (à générer en frontend)
        id_joueur = params["player_id"];
        
        let online_id = sessionStorage.getItem("id");
        
        interface_jeu.updateNom(id_joueur, nom_joueur); // On met à jour le nom du joueur 
        
        socket.emit("envoiNomJoueur", {"nom": nom_joueur, "id": id_joueur, "online_id": online_id}); // On envoie le nom du joueur, et son ID ici (pour faciliter le stockage)
        
        grille = new Grille(params["grid"], sm);
        
        joueur_actuel = joueurs[id_joueur];
        
        resizeGrid();
        socket.emit("gridCreated");
        
        
    });
    
    socket.on("envoiNomVersClient", function(params) {
        
        if(params["id"] !== id_joueur) {
            interface_jeu.updateNom(params["id"], params["nom"]);
        } else {
            joueur_actuel.nom = params["nom"];
        }
    });
    
    
    
    
    socket.on("envoiGrille", function(params) {

        grille = new Grille(params["grille"], sm);
        
        resizeGrid();
        socket.emit("gridCreated"); // On dit au serveur que la grille est créée, ce qui lance la partie
        
        
    });
    
    socket.on("lancementTour", function(infos) { // Param joueur : ID du joueur auquel c'est le tour
        resetPlayerPositions(); // On réétablit la position des joueurs
        console.log(infos);
          
        if(!local && infos["joueur_actuel"] === id_joueur || local) { // On vérifie si c'est à ce joueur de faire son tour ou si on est en local pour lui laisser se déplacer

            gestionTour(infos["joueur_actuel"], infos["dep_possibles"], infos["ancienne_arme"]);   
            
        } 
        
    });
    
    socket.on("confirmationDeplacement", function(infos) { // Contient la position et l'arme (-1 si la même, autre si nouvelle)
        
        let nv_position = infos["position"],
            arme = infos["id_arme"],
            nv_grille = infos["grille"],
            cur_player = infos["cur_player"], // Utilisé uniquement en online pour savoir si on doit déplacer ce joueur
            prev_position = infos["prev_position"],
            arme_posee;
        
        grille.updateGrille(nv_grille); // Réétablit la grille telle que modifiée sur le serveur

        if (typeof arme === "number" && arme !== -1) { // Si le joueur tombe sur une nouvelle arme
            
            if(local) { // Offline
                
                joueur_actuel.updateArme(arme);
                interface_jeu.updateArme(joueur_actuel);

            } else { // Online
                let playerToUpdate = (id_joueur === cur_player.id ) ? joueur_actuel : getEnemy();
                
                if(id_joueur === cur_player.id) { // If the local player got a new weapon
                    joueur_actuel.updateArme(arme);
                    interface_jeu.updateArme(joueur_actuel);   
                     
                } else { // If the remote player got a new weapon
                    playerToUpdate.updateArme(arme);
                    interface_jeu.updateArme(playerToUpdate);   
                }
                
                
                
            }
            
        }
        
        let armeTourPrecedent;
        
        if(arme instanceof Array) { // Si le joueur était passé sur une arme, on aura dans arme[0] l'id de l'arme à poser
                armeTourPrecedent = arme[0];
            }

        if(!local) { // Online
            
            if(id_joueur === cur_player.id) { // Si c'est au joueur local de jouer
                
                arme_posee = grille.updateGrilleEcran(nv_position, arme, prev_position, joueur_actuel, armeTourPrecedent); // On remet à jour la grille front    
                
                if(arme_posee) {
                    joueur_actuel.ancienne_arme = -1;
                }
            } else { // Si on est sur l'autre joueur

                arme_posee = grille.updateGrilleEcran(nv_position, arme, prev_position, cur_player, armeTourPrecedent);
            }
            
        } else {

            arme_posee = grille.updateGrilleEcran(nv_position, arme, prev_position, joueur_actuel, armeTourPrecedent); // On remet à jour la grille front    
            joueur_actuel.position = nv_position; // On met la position du joueur à jour côté client
        }
        
        socket.emit("newTurn", arme_posee);
    });
    
    socket.on("resultatDecision", function(infosDegats) {

        let id = infosDegats["id"],
            vie_restante = infosDegats["remaining_hp"],
            arme = infosDegats["arme"],
            posture = infosDegats["posture"];
        
        let soundList = [`WEAPON${arme}`];
        
        if (!posture)  
            soundList.push("DEFENSE"); // If the player receiving was in defensive position, we also play the defense sound

        console.log(soundList);
        sm.playSound(soundList);
        
        interface_jeu.updateInterfaceCombat(id, vie_restante, function() {
            socket.emit("newTurn");
        });
    });
    
    socket.on("partieTerminee", function(infos) {

        if(local) {
            affichageFinPartieOffline(infos); 
        } else {
            affichageFinPartieOnline(infos, joueur_actuel, sm);
        }
    });
    
    socket.on("lancementTourCombat", function(params) {
        
        let joueur_tour_actuel = params["joueur_actuel"];
        
        if(local || joueur_tour_actuel === id_joueur) {

            interface_jeu.genInterfaceCombat(joueur_tour_actuel);

            $("#btn_attaque, #btn_defense").on("click", gestionCombat);
        }
    });
});


/* 
    
    FONCTIONS
        
*/
    
    
    function gestionTour(id_joueur_actuel, dep_possibles, anc_arme) {
        
        if(typeof id_joueur === "undefined") { // Offline, joueur_actuel définit le joueur dont c'est le tour (en online, il définit le joueur local)
            joueur_actuel = joueurs[id_joueur_actuel];
            
            joueur_actuel.ancienne_arme = anc_arme; // A voir, on pourrait aussi conditionner l'attribution au fait que anc_arme soit différente de -1      
        }
        
        let position = joueur_actuel.position;
        grille.afficherDepDispos(dep_possibles, deplacerJoueur);
        

    }
    
    function deplacerJoueur(e) {
        e.stopPropagation();

        $(".dep_possible").off("click", deplacerJoueur);

        var position = e.target.id.split("-");

        if (position.length !== 2) { // Si l'on clique sur l'image d'une arme, on recherche l'id du parent
            position = $(e.target).parent().attr("id").split("-");
        }

        position = position.map(val => parseInt(val));

        socket.emit("demandeDeplacement", position);
        
    
    }

function gestionCombat(e) { // Fonction callback de gestionTour en cas de combat

        gestionCombatFront(); // Enlève le listener des boutons et slidetoggle les boutons puis les efface

        var decision = e.target.id.replace("btn_", "");

        socket.emit("decisionJoueur", decision);

}