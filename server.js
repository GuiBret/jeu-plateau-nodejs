"use strict";

let express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    ejs = require("ejs"),
    i18n = require("i18n"),
    Game = require("./node_modules/jeu-backend/game.js"),
    DatabaseConnection = require("./node_modules/jeu-backend/utils/database_connection.js"),
    DBConnection = new DatabaseConnection(),
    GameHub = require("./node_modules/jeu-backend/managers/GameHub.js"),
    gh = new GameHub(),
    GameSearchSocketManager = require("./node_modules/jeu-backend/managers/GameSearchSocketManager"),
    GameSocketManager = require("./node_modules/jeu-backend/managers/GameSocketManager");

i18n.configure({
    locales:["en", "fr"],
    directory: __dirname + '/locales',
    autoReload:true
});

app.use(i18n.init);

app.set("view engine", "ejs");
app.use(express.json());

let RequestManager = require("./node_modules/jeu-backend/managers/RequestManager.js"),
    rm = new RequestManager(app, DBConnection, i18n);

server.listen(5000);


io.sockets.on("connection", function(socket) {
    let gssm = new GameSearchSocketManager(socket, DBConnection, io, gh, i18n);
});

/* Serveur de jeu, port 5001*/

let gameServer = require("http").Server(app),
    io_gameserv = require('socket.io')(gameServer);

gameServer.listen(5001);

io_gameserv.on("connection", function(socket) {
    let gsm = new GameSocketManager(socket, DBConnection, io_gameserv, gh);
});
