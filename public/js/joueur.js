
class Joueur {
    constructor(id, nom) {
        this.nom = nom;
        this.id = id;
        this.arme = new Arme(1);
        this.design = this.arme.getDesignArmeJoueur();
        this.posture = false; // Attaque : true, défense : false
        this.pv = 100;
        this.position = [-1, -1],
        this.ancienne_arme = -1; // Sera utilisé en cas de ramassage d'une arme, pour la remettre à l'emplacement d'origine
    }
    
    updateArme(id_arme) {
    
        this.arme = new Arme(id_arme); // On update l'objet arme

        this.design = this.arme.getDesignArmeJoueur(); // On update le design de l'arme
    }
    
    definirNouvelleArme(id_arme) { // Appelée au tour suivant la récupération de l'arme, pour dire à la grille front de mettre à jour si !== -1
        this.ancienne_arme = id_arme;
    }
    
    
    updatePosture(bool_posture) {
        this.posture = bool_posture;
    }
    
    recevoirDegats(damage) {
        this.pv -= damage;
    }
}

