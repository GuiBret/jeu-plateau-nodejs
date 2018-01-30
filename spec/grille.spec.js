const Grille = require("../node_modules/jeu-backend/grille"),
      Joueur = require("../node_modules/jeu-backend/joueur");

describe("grid generation", function() {
    var grille = new Grille(new Joueur(0, "Joueur 1"), new Joueur(1, "Joueur 2")); // Grid created in the constructor
    
    
    it("should contain a well-sized grid", function() {
       let grille_back = grille.grille;
        
        
        expect([grille_back.length, grille_back[0].length]).toEqual([11, 11]);
    });
    
    it("should contain a correct number of darkened tiles (13 for a 11x11 grid)", function() {
        let darkened_tiles = 0,
            g = grille.grille;
        for(let y = 0; y < 11; y++) {
            for(let x = 0; x < 11; x++) {
                if(g[x][y] === "X") {
                    darkened_tiles += 1;
                }
            }
        }
        
        expect(darkened_tiles).toEqual(13);
    });
    
    it("should not let user go left when he is at a position like [0; y]", function() {
       let directions = grille.verifDeplacementDirection([0,1], 2);
        
        expect(directions.length).toEqual(0);
    });
    
    it("should not let user go right when he is at a position like [10; y]", function() {
       let directions = grille.verifDeplacementDirection([10,1], 4);
        
        expect(directions.length).toEqual(0);
    });
    
    it("should not let user go up when he is at a position like [x; 0]", function() {
       let directions = grille.verifDeplacementDirection([1,0], 1);
        
        expect(directions.length).toEqual(0);
    });
    
    it("should not let user go down when he is at a position like [x; 10]", function() {
       let directions = grille.verifDeplacementDirection([1,10], 3);
        
        expect(directions.length).toEqual(0);
    });
    
})