const GameSocketManager = require("../node_modules/jeu-backend/managers/GameSocketManager"),
      DatabaseConnection = require("../node_modules/jeu-backend/utils/database_connection"),
      GameHub = require("../node_modules/jeu-backend/managers/GameHub");

let express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    DBConnection = new DatabaseConnection(),
    gh = new GameHub();


describe("enterRoom", function() {

    beforeAll(function() {
        
        let socket = { // Fake socket class
            emit: function(msg) {
            
            },
            join: function() {
            
            },
            on: function() {
            
            }
        }
        
        this.gh = gh;
        this.game_id = gh.createGame();
        this.gsm = new GameSocketManager(socket, DBConnection, io, this.gh);
        
        
    });
    // Requiert un vrai socket
    /*
   it("should make the user enter the room", function(done) { // ???
       spyOn(this.gsm.socket, "emit").and.callThrough();
       this.gsm.enterRoom(this.game_id);

       expect(this.gsm.io.of(`room-${this.game_id}`).clients((err, clients) => {
           
           expect(clients.length).toEqual(0);
           
           done();
       }));
   });
   */
    
    it("should have triggered the join function", function(done) {
        spyOn(this.gsm.socket, "join");
        
        this.gsm.enterRoom(this.game_id).then(() => {
            expect(this.gsm.socket.join).toHaveBeenCalledWith(`room-game${this.game_id}`);
            done();
        });
        
        
    });
    
    afterAll(function(done) {
        gh.deleteGame(this.game_id);
        done();
    })
});
/* PBs online tests : requiert 2 sockets + vrais sockets */
describe("onlineGameConfirmation", function() {
    
});

describe("localGameConfirmation", function() {
    beforeAll(function() {
        
        let socket = { // Fake socket class
            emit: function(msg) {
            
            },
            join: function() {
            
            },
            on: function() {
            
            }
        }
        
        this.gh = gh;
        this.game_id = gh.createGame();
        this.gsm = new GameSocketManager(socket, DBConnection, io, this.gh);
        
        
    });
    
   it("should have emitted envoiGrille with the grid content", function() {
       spyOn(this.gsm.socket, "emit");

       this.gsm.localGameConfirmation({"id": this.game_id, "noms": ["machin", "truc"]}).then(() => {
           expect(this.gsm.socket.emit).toHaveBeenCalledWith("envoiGrille", {"grille": jasmine.any(Object)});
       });
       
       
   });
    
    it('should contain the correct ID', function() {
        expect(this.gsm.socket.gameID).toEqual(this.game_id);
    });
    
    afterAll(function(done) {
        this.gsm.gh.deleteGame(this.game_id);
        done();
    });
});

describe("usernameManagement", function() {
    beforeAll(function() {
        let socket = { // Fake socket class
            emit: function(msg) {
            
            },
            join: function() {
            
            },
            on: function() {
            
            }
        }
        
        this.gh = gh;
        this.game_id = gh.createGame();
        this.gsm = new GameSocketManager(socket, DBConnection, io, this.gh);
        
    });
    
    it("should have emitted envoiNomVersClient to the room with correct settings", function(done) {
        
        let params = {"nom": ["machin", "truc"], "id": 1};
        this.gsm.socket.gameID = this.game_id;
        
        
        this.gsm.gh.getGame(this.game_id).then((game) => {
            game.setParams(params["nom"], true, this.gsm.socket);
            spyOn(this.gsm.io.in(`room-game${this.game_id}`), "emit");
            this.gsm.usernameManagement(params).then(() => {
                
                expect(this.gsm.io.in(`room-game${this.game_id}`).emit).toHaveBeenCalledWith("envoiNomVersClient", {"nom": ["machin", "truc"], "id": 1});
                done();
            });    
        });
        
    });
    
    afterAll(function() {
        this.gsm.gh.deleteGame(this.game_id);
    })
});

describe("launchFirstTurn", function() {
    beforeAll(function() {
        let socket = { // Fake socket class
            emit: function(msg) {
            
            },
            join: function() {
            
            },
            on: function() {
            
            }
        }
        
        this.gh = gh;
        this.game_id = gh.createGame();
        this.gsm = new GameSocketManager(socket, DBConnection, io, this.gh);
        
    });
    
    it('should emit lancementTour (as local) with correct settings', function(done) {
        let params = {"nom": ["machin", "truc"], "id": 1};
        this.gsm.socket.gameID = this.game_id;
        
        
        this.gsm.gh.getGame(this.game_id).then((game) => {
            game.setParams(params["nom"], true, this.gsm.socket);
            
            this.gsm.usernameManagement(params).then(() => {
                spyOn(this.gsm.socket, "emit");
                this.gsm.launchFirstTurn().then(() => {
                    expect(this.gsm.socket.emit).toHaveBeenCalledWith("lancementTour", {"joueur_actuel": 0, "combatLance": false, "dep_possibles": game.getPossibleMoves(0), "ancienne_arme": -1});
                    done();
                    
                });
            });    
        });
    });
    
    afterAll(function(done) {
        this.gsm.gh.deleteGame(this.game_id);
        done();
    });
});

describe("requestMovement", function() {
    beforeAll(function() {
        let socket = { // Fake socket class
            emit: function(msg) {
            
            },
            join: function() {
            
            },
            on: function() {
            
            }
        }
        
        this.gh = gh;
        this.game_id = gh.createGame();
        this.gsm = new GameSocketManager(socket, DBConnection, io, this.gh);
        
    });
    
   it("should emit confirmationDeplacement with correct settings", function(done) {
       let params = {"nom": ["machin", "truc"], "id": 1};
        this.gsm.socket.gameID = this.game_id;
        
        
        this.gsm.gh.getGame(this.game_id).then((game) => {
            game.setParams(params["nom"], true, this.gsm.socket);
            
            this.gsm.usernameManagement(params).then(() => {
    
                this.gsm.launchFirstTurn().then(() => {
                    spyOn(this.gsm.socket, "emit");
                    let position = game.getCurrentPlayer().position,
                        new_position,
                        dep_possibles = game.grille.calculDepDispos(position);
                    
                    if(game.grille.elemDansArray(dep_possibles, [position[0] + 1, position[1]])) { // Si le joueur peut aller à droite
                        new_position = [position[0] + 1, position[1]];
                    } else if (game.grille.elemDansArray(dep_possibles, [position[0], position[1 + 1]]))  { // Si le joueur peut aller en bas
                        new_position = [position[0], position[1] + 1];
                    } else if(game.grille.elemDansArray(dep_possibles, [position[0] -1, position[1]])) { // Si le joueur peut aller à gauche
                        new_position = [position[0] - 1, position[1]];
                    } else { // S'il peut aller en haut (on va supposer qu'il ne sera pas bloqué)
                        new_position = [position[0], position[1] - 1];
                    }
                    
                    
                    this.gsm.requestMovement(new_position).then(() => {
                        
                        expect(this.gsm.socket.emit).toHaveBeenCalledWith("confirmationDeplacement", {"position": new_position, "prev_position": position, "id_arme":-1, grille:game.getCurrentGrid(), cur_player: jasmine.any(Object) });
                    
                        done();             
                        
                    });
                    
                    
                    
                });
            });    
        });
       
   });
    
    afterAll(function(done) {
        this.gsm.gh.deleteGame(this.game_id);
        done();
    });
});


/* 
describe("launchNewTurn", function() {
    
    beforeAll(function() {
        let socket = { // Fake socket class
            emit: function(msg) {
            
            },
            join: function() {
            
            },
            on: function() {
            
            }
        }
        
        this.gh = gh;
        this.game_id = gh.createGame();
        this.gsm = new GameSocketManager(socket, DBConnection, io, this.gh);
        
    });
    
    
    afterAll(function(done) {
        this.gsm.gh.deleteGame(this.game_id);
        done();
    });
    
    
});

*/