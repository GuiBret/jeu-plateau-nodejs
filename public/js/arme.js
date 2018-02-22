class Arme {

    constructor(id, position) {

        this.id = id;

        this.position = position;

        switch(this.id) {

            case 1: // Arme standard
                this.degats = 10;
                this.nom = __("Revolver");
            break;

            case 2:
                this.degats = 15
                this.nom = __("Fusil");
            break;
            case 3:
                this.degats = 20;
                this.nom = __("Fusil à pompe");
            break;
            case 4:
                this.degats = 25;
                this.nom = __("Lance-roquette");
            break;

        }       
    }

    getDesignArmeJoueur() {
            return "/public/img/j_arme"+ String(this.id)+ ".png";

    }

}
