const RequestManager = require("../node_modules/jeu-backend/managers/RequestManager.js"),
      express = require("express"),
      DBConnection = require("../node_modules/jeu-backend/utils/database_connection.js");

describe("Routing behavior (get ...)", function() {
    beforeEach(function() { // Creating fake req and res (we just want to check if they're called, reproduce their behavior)
        this.app = express();
        this.rm = new RequestManager(this.app, {});
        
        this.req = {
            query: {},
            params: {},
            body: {},
          };

          this.res = {
            status: jasmine.createSpy().and.callFake(function(msg) {
              return this;
            }),
            render: jasmine.createSpy().and.callFake(function(msg) {
              return this;
            
            })
        }
    });
    
    
        afterEach(function() {
            //expect(this.res.status.callCount).toEqual(1);
            //expect(this.res.send.callCount).toEqual(1);
    
        });
    
    it("should get the connection page (with 'tpl-connect-panel.js')", function() {
       
        spyOn(this.rm, "getMainPage").and.callThrough();
        this.rm.getMainPage(this.req, this.res);
       
       expect(this.res.render).toHaveBeenCalledWith("tpl-connect-panel.ejs"); 
    });
    
    it("should get the main menu template (main-menu.ejs)", function() {
        spyOn(this.rm, "getMenu").and.callThrough();
        this.rm.getMenu(this.req, this.res);
        
        expect(this.res.render).toHaveBeenCalledWith("main-menu.ejs");
    });
    
    it("should get the offline game page(game.ejs)", function() {
        this.req.params.mode = "local";
        spyOn(this.rm, "getGamePage").and.callThrough();
        this.rm.getGamePage(this.req, this.res);
        
        expect(this.res.render).toHaveBeenCalledWith("game.ejs");
    });
    
    it("should get the online game page (game_online.ejs)", function() {
        spyOn(this.rm, "getGamePage").and.callThrough();
        this.rm.getGamePage(this.req, this.res);
        
        expect(this.res.render).toHaveBeenCalledWith("game_online.ejs");
    });

 
});

describe("setoptions (post request)", function() {
    beforeAll(function() {
        this.app = express();
        this.rm = new RequestManager(this.app, new DBConnection());
        
        this.req = {
            query: {},
            params: {},
            body: {"joueur_concerne": 1, "animations": 1, "volume": .5}, // We keep the default settings, in order not to break the future tests
          };
        
    });
    it("should have called setoptions", function() {
        spyOn(this.rm.DBConnection, "setOptions").and.callThrough();
        
        this.rm.setOptions(this.req, this.res);
        
        expect(this.rm.DBConnection.setOptions).toHaveBeenCalled();
    })
})

