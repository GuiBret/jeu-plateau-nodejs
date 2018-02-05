const DatabaseConnection = require("../node_modules/jeu-backend/utils/database_connection");


describe("database connect", function() {
   beforeAll(function() {
       this.db_connection = new DatabaseConnection();
   }); 
    
    it("should properly connect to the user and get its data", function(done) {
        
        let connectionData = {"username": "usertest", "password": "monjeuplateau"};
        
        this.db_connection.getUserData(connectionData).then( (res)=> {
           
            expect(res.id).toEqual(1);   
            done();
        });

        
        
        
    });
    
    
    it("should handle an incorrect password", function(done) {
        
        let connectionData = {"username": "usertest", "password": "monjeudeplateau"}; // Deliberately wrong password
        
        
        this.db_connection.getUserData(connectionData).then( (res)=> {
           
            expect(res).toEqual("WRONG_PASSWORD"); // The function will return 1 if the user is not in the database   
            done();
        }).catch((err) => {
            console.info("Erreur");

        });
        
        
    });
    
    
});


describe("user management", function() {
    
    beforeAll(function() {
           this.db_connection = new DatabaseConnection();
       });
    
    
    it("should perform a proper user creation", function(done) {
        
        let params = {"username": "usertest3", "password": "monmotdepasse"};
        
        
        this.db_connection.createUser(params).then((res) => {
            
            expect(res.username).toEqual("usertest3");
            this.db_connection.removeUser(params["username"]); // We remove the user when it's done in order to be able to retest it later
            done();
        }).catch((err) => {

            done();
        });
        
        
    });
    
    it("should be able to detect the fact that a user tries to enter a username which is already in the DB", function(done) {
       let params = {"username": "usertest", "password": "monmotdepasse"};
        
        this.db_connection.createUser(params).then((res) => {
            expect(res.username).toEqual("usertest3");
            this.db_connection.removeUser(params["username"]); // We remove the user when it's done in order to be able to retest it later
            done();
        }).catch((err) => {
            expect(err).toEqual("USERNAME_TAKEN");
            done();

        });
        
        
    });

});

describe("match data", function() {
    beforeAll(function() {
           this.db_connection = new DatabaseConnection();
    });
    
    
    it("should be able to get the user's games", function(done) {
        let matches = this.db_connection.getUserMatches(1); // We"re looking for the matches of one of the dummy users
        this.db_connection.getUserMatches(1).then((res) => {
           expect(res.length).toEqual(2); // 2 dummy games will be added to the DB
            done();
        }).catch((err) => {
            console.log(err);
            
        });
        
        
    });
    
    it("should be able to include a match", function(done) {
       let match_info = {"player1": 1, "player2": 2, "winner": 1, "type":"online"};
        
        this.db_connection.addMatch(match_info).then((res) => {
           expect(res).toEqual("SUCCESSFULLY_ADDED"); 
            this.db_connection.removeLastMatch();
            done();
        })
        .catch((err) => {
          console.log(err);  
        });
        
        
    });
    
});

describe("getOptions", function() {
    beforeAll(function() {
        this.db_connection = new DatabaseConnection();
    });
    
    it("should able to get the options (set as default) for the first test user", function(done) {
        this.db_connection.getOptions(1).then((res) => {
            expect(res.volume).toEqual(.5);
            done();
        })
    })
});

