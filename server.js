let express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    ejs = require("ejs"),
    Game = require("./node_modules/jeu-backend/game.js"),
    path = require("path"),
    DatabaseConnection = require("./node_modules/jeu-backend/utils/database_connection.js"),
    DBConnection = new DatabaseConnection(),
    GameHub = require("./node_modules/jeu-backend/managers/GameHub.js"),
    gh = new GameHub(),
    GameSearchSocketManager = require("./node_modules/jeu-backend/managers/GameSearchSocketManager"),
    GameSocketManager = require("./node_modules/jeu-backend/managers/GameSocketManager");
    

app.set("view engine", "ejs");

let RequestManager = require("./node_modules/jeu-backend/managers/RequestManager.js"),
    rm = new RequestManager(app, DBConnection);

server.listen(process.env.PORT || 5000);


io.sockets.on("connection", function(socket) {
    let gssm = new GameSearchSocketManager(socket, DBConnection, io, gh);    
});

/* Serveur de jeu, port 5001*/

let gameServer = require("http").Server(app),
    io_gameserv = require('socket.io')(gameServer);

gameServer.listen(process.env.PORT || 5001, function() {
    
});

io_gameserv.on("connection", function(socket) {
    let gsm = new GameSocketManager(socket, DBConnection, io_gameserv, gh);
});
