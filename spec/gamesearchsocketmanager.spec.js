const GameSearchSocketManager = require("../node_modules/jeu-backend/managers/GameSearchSocketManager"),
      DatabaseConnection = require("../node_modules/jeu-backend/utils/database_connection"),
      GameHub = require("../node_modules/jeu-backend/managers/GameHub");

let express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    DBConnection = new DatabaseConnection(),
    gh = new GameHub();




describe("game search socket", function() {
    beforeEach(function() {
        let socket = {
            emit: function(msg) {

            },
            on: function(socketName) {

            }
          };

        this.gssm = new GameSearchSocketManager(socket, DBConnection, io, gh);


    });



    it("should emit partieLocaleTrouvee when localGameRequest has been called", function() {
       spyOn(this.gssm.socket, "emit").and.callThrough();
        this.gssm.localGameRequest();

        expect(this.gssm.socket.emit).toHaveBeenCalledWith("partieLocaleTrouvee", jasmine.any(Object));
    });

});
