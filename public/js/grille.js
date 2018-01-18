/* Classe grille frontend : contient toutes les fonctions d'affichage de la carte (les fonctions de calcul sont réalisées par le serveur */

class Grille {
    constructor(grid_content) {
        this.grille = grid_content;
        this.genGrilleEcran();
        this.dimensionsJoueurs; // Pour animations
    }
    
    genGrilleEcran() { // Génération de la carte frontend

        var grilleEcran = $("tbody"),
            x = 0,
            grille_back = this.grille,
            armes = ["B", "C", "D"];

        for (let y = 0; y < 11; y += 1){

            var ligne = $("<tr></tr>");
            x = 0;

            for(x; x < 11; x++) {

                var case_jeu = $("<td></td>"),
                    case_actuelle = grille_back[x][y];

                case_jeu.attr("id", String(x)+ "-"+ String(y));

                if(case_actuelle == "X") { // On applique la classe grisee qui inversera les couleurs 

                    case_jeu.addClass("grisee");

                }

                if(case_actuelle === "1" || case_actuelle === "2") { // Ajout des images des joueurs

                    var image_joueur = $("<img></img>"),
                        nb_joueur = grille_back[x][y];


                    image_joueur.attr("src", "/public/img/j_arme1.png");
                    image_joueur.addClass("joueur"+ nb_joueur);
                    case_jeu.append(image_joueur);
                    
                } else if(armes.indexOf(case_actuelle) >= 0) { // Si on tombe sur une arme

                    

                    var nb_arme = case_actuelle.charCodeAt(0) - 63, // Donnera [65, 66, 67, 68] - 63 = 1, 2,3,4, permet de trouver facilement l'arme4
                       img_arme = $("<img></img>");

                    

                    img_arme.attr("src", "/public/img/arme"+String(nb_arme-1)+".png");

                    img_arme.addClass("img_arme");

                    case_jeu.append(img_arme);

                    

                }
                ligne.append(case_jeu);
            }
            grilleEcran.append(ligne);

        }



    }
    
    afficherDepDispos(dep_dispos, _callback) { // Fonction ajoutant les déplacements possibles sur la grille à l'écran, callback : deplacerJoueur (main.js)

        var dep_dispo = [];

        for(dep_dispo of dep_dispos) {

            var case_deplacement = $("#"+ dep_dispo.join("-")),

                enfants = []; // Enfants potentiels de la case (joueur ou arme)

            case_deplacement.addClass("dep_possible");

            if(case_deplacement.children().length > 0) { // Si l'utilisateur clique sur une case contenant une arme

                if(case_deplacement.find("img.img_arme").length !== 0) { // Si un des déplacements disponibles contient une arme ...

                    case_deplacement.children("img.img_arme").addClass("dep_possible"); // On permet à l'utilisateur de cliquer dessus

                }

            }

        }

        $(".dep_possible").on("click", _callback);        

    }
    
    updateGrilleEcran(nv_position, arme, anc_position, joueur_actuel, armeTourPrecedent) {

        var image_joueur = $("<img></img>"),
                 anc_case = $("#"+anc_position.join("-")),
                 nv_case = $("#"+ nv_position.join("-")),
                 arme_posee = false;
            
            console.log(anc_case);
            anc_case.html(""); // On efface la case actuelle
        
        

            var anc_case_back = this.grille[anc_position[0]][anc_position[1]];


            if(typeof armeTourPrecedent !== "undefined") { // Si le joueur avait ramassé une arme au tour précédent
 
                var img_arme = $("<img class='img_arme'></img>");

                img_arme.attr("src", "/public/img/arme" + armeTourPrecedent + ".png");

                anc_case.html(img_arme);  

                
                //joueur_actuel.ancienne_arme = -1;
                arme_posee = true; // Signale au serveur qu'on a posé une arme au tour précédent (lui dit de reset joueur_actuel.ancienne_arme);
            }
        
        if(1+1 === 2) { // Condition préparant arrivée des options (si animations activées, on anime, sinon on efface et affiche uniquement), ici animation
            this.appliquerAnimation(anc_case, nv_case, joueur_actuel);
            
        } else {
            
            nv_case.html(image_joueur); // On applique l'image à la nouvelle case
        }
            
        

        

        $(".dep_possible").removeClass("dep_possible"); // On efface les déplacements possibles
        
        return arme_posee;


   
            
    }
    
    
    
    /* 
    
        FONCTIONS UTILITAIRES
        
    */
    getPosJoueur(joueur_actuel) {
        for(let y = 0; y < 11; y++) {
            for(let x = 0; x < 11; x++) {
                if(parseInt(this.grille[x][y]) === joueur_actuel ) {
                    return [x, y];
                }
            }
        }
    }
    
    
    updateGrille(grid) {
        this.grille = grid;
    }
    
    appliquerAnimation(anc_case, nv_case, joueur_actuel) {
        
        if(!this.dimensionsJoueurs) { // Si on n'a pas les dimensions d'un joueur (normalement au premier tour), on les calcule et les stocke (pour que l'image qui se déplacera ait la même taille que l'image d'origine)
            this.dimensionsJoueurs = {height: $(".joueur2").height(), width: $(".joueur2").width()};
        
        }
        
        
        
        let anc_position = this.calculPositionAnimation(anc_case),
            nv_position = this.calculPositionAnimation(nv_case),
            $elem_animation = $(`<img src='/public/img/j_arme1.png' class="animation-deplacement joueur${joueur_actuel.id+1}-anim" />`),
            image_joueur = $("<img></img>");
    
        
            
        image_joueur.attr("src", `/public/img/j_arme${joueur_actuel.arme.id}.png`);
        image_joueur.addClass("joueur"+ String(joueur_actuel.id+1)); // On applique la classe au joueur (permettant le changement de couleur)
        
        $elem_animation.offset(anc_position);
        $elem_animation.css(this.dimensionsJoueurs); // On applique les dimensions à l'image
        
        $("body").append($elem_animation);
        
        $elem_animation.animate({left: nv_position.left, top:nv_position.top}, 400, () => {
            
            // Quand l'animation est finie, on affiche l'image de la nouvelle position et on supprime l'animation 
            nv_case.html(image_joueur);
            
            $(".animation-deplacement").remove();
            
        });
    }
    
    calculPositionAnimation(case_jeu) { // Calcule la position de départ de l'image qu'on animera pour simuler le déplacement (besoin d'avoir le point central de l'image d'origine)
        let position = case_jeu.offset(),
            dimension_case = $("td").height();
        console.log(position);
        position.left += ((dimension_case - this.dimensionsJoueurs.width) / 2); 
        position.top += ((dimension_case - this.dimensionsJoueurs.height) / 2);
        console.log(position);
        return position;
    }


}