class Arme {

    constructor(id, position) {

        this.id = id;

        this.position = position;

        switch(this.id) {

            case 1: // Arme standard
                this.degats = 10;
                this.nom = "Revolver";
            break;

            case 2:
                this.degats = 15
                this.nom = "Fusil";
            break;
            case 3:
                this.degats = 20;
                this.nom = "Fusil à pompe";
            break;
            case 4:
                this.degats = 25;
                this.nom = "Lance-roquette";
            break;

        }
    }

    getDesignArmeJoueur() {
            return "/public/img/j_arme"+ String(this.id)+ ".png";

    }

}
