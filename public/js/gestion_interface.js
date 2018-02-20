/*globals $:false */

/*jshint esversion:6*/



class Interface {

    constructor(joueur1, joueur2) {

        

        $("#interface").css("display", "inline");

        $("#nom_j1").html(joueur1.nom);

        $("#nom_j2").html(joueur2.nom);

    }


    genInterfaceCombat(joueur_actuel) { // Affiche les boutons attaque et défense
        
        var $div_combat = $("<div class='col-12 d-flex justify-content-around'></div>"),

            $btn_attaque = $("<button class='float-left' id='btn_attaque'>Attaquer</button>"),

            $btn_defense = $("<button class='float-right' id='btn_defense'>Défendre</button>"),

            id_joueur = joueur_actuel + 1;

        

        $div_combat.attr("id", "boutons_combat");
        $div_combat.css("display", "none");


        $div_combat.append($btn_attaque);
        $div_combat.append($btn_defense);
        
        $("#interface_"+ String(id_joueur)).append($div_combat);

        $div_combat.slideDown(200);

    }

    

    updateInterfaceCombat(id, remaining_hp, _callback) { // Met à jour la barre de vie et le texte des PV, on envoie l'id du joueur concerné pour replacer facilement les données
        
        $("#barre_j"+ String(id+1)).animate({"value" : remaining_hp}, 800, "swing", function() {
            _callback();
        });

        $("#vie_j"+ String(id+1)).html(String(remaining_hp));


    }

    

    updateArme(joueur, arme) { // Fonction mettant à jour le nom, l'image et les degâts de l'arme dans l'interface
        
        $(`#nom_arme_j${joueur.id+1}`).html(joueur.arme.nom);

        $(`#degats_arme_j${joueur.id+1}`).html(joueur.arme.degats);

        $(`.joueur${joueur.id+1}`).attr("src", joueur.design);

        $(`.interface-joueur${joueur.id+1}`).attr("src", joueur.design);

    }
    
    updateNom(id_joueur, nom_joueur) {
        $("#nom_j" + String(id_joueur+1)).html(nom_joueur);
    }

    

}