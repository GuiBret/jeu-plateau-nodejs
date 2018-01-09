const Game = require("../node_modules/jeu-backend/game"),
      socket = require("socket.io");

describe("game init", function() {
    var g = new Game(Math.round(Math.random() * 10000));
  
   it("should create a random game", function() {
       
       expect(g).toEqual(jasmine.any(Game));
   });
    
    it("should have a correct gameID (between 0 and 10000)", function() {
       expect(g.game_id >= 0 && g.game_id <= 10000).toBeTruthy();
    });
});

describe("socket management", function() {
   
    
    beforeEach(function() {
        this.g = new Game();     
    });
    
    it("should correctly store the user's socket", function() {
       let socket_j1 = new socket();
        this.g.addSocket(socket_j1);
        
        expect(this.g.socket_j1).toBe(socket_j1);
        
    });
    
    it("should return the user's id in the game", function() {
       let socket_j1 = new socket(),
           socket_j2 = new socket(); 
        let player1_id = this.g.addSocket(socket_j1),
            player2_id = this.g.addSocket(socket_j2);
        
        expect(player1_id).toEqual(0);
        expect(player2_id).toEqual(1);
        
    });
    
    it("should handle the fact that another socket tries to enter the game (return -1)", function() {
        let socket_j1 = new socket(),
            socket_j2 = new socket(),
            socket_j3 = new socket(); 
        this.g.addSocket(socket_j1),
        this.g.addSocket(socket_j2);
        let error_socket = this.g.addSocket(socket_j3);
        
        expect(error_socket).toBe(-1);
        
    });
    
    it("should correctly rename a player in backend", function() {
       let player_info = {"nom": "JoueurTest", "id": 1};
        
        this.g.setParams(["Joueur 1", "Joueur 2"], false, null);
        this.g.ajouterInfosJoueur(player_info);
        expect(this.g.j2.nom).toEqual("JoueurTest");
    });
    
    it("should properly handle turns", function() {
       let cur_nb_turns = this.g.nb_tours;
    
        this.g.incrementTurns();
        
        expect(this.g.nb_tours).toBe(cur_nb_turns + 1);
    });
}); 