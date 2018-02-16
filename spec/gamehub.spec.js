const Game = require("../node_modules/jeu-backend/game"),
      GameHub = require("../node_modules/jeu-backend/managers/GameHub");

describe("game creation", function() {
    beforeAll(function() { // We start by creating a GameHub instance and a game inside it
        this.gh = new GameHub();
        this.game_id = this.gh.createGame();
        
    });
    
    it("should have stored the proper ID in the game", function() {
       let game = this.gh.getGame(this.game_id, (game) => {
            expect(game.game_id).toEqual(this.game_id);   
       });
        
        
    });
    
    it("should have stored the game ID in the gameIDlist", function() {
        expect(this.gh.gameIDlist.indexOf(this.game_id)).not.toEqual(-1); 
    });
});


describe("game deletion", function() {
    beforeAll(function() { // We start by creating a GameHub instance and a game inside it
        this.gh = new GameHub();
        this.game_id = this.gh.createGame();
        
        this.gh.deleteGame(this.game_id);


    });
    
    it("should have properly deleted the ID", function(done) {
        this.gh.getGame(this.game_id).catch((error) => {
            expect(error).toEqual("NO_GAME_FOUND");    
            done();
        });
        
    });
    
    it("should have stored the game ID in the gameIDlist", function() {
        expect(this.gh.gameIDlist.indexOf(this.game_id)).toEqual(-1); 
    });
});
