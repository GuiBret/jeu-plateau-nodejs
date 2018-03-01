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
            expect(res.username).toEqual("usertest");
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
       let match_info = {"winner": 1, "loser": 2, "type":"online", "remaining_hp": 25};

        this.db_connection.addMatch(match_info).then((res) => {
           expect(res).toEqual("SUCCESSFULLY_ADDED");
            this.db_connection.removeLastMatch();
            done();
        })
        .catch((err) => {
          console.log(err);
            done();
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


/* We won't test the fact that a non-existing user has tried to modify its options, because we will have blocked it upstream */

describe("setOptions", function() {
    beforeAll(function() {
        this.db_connection = new DatabaseConnection();
    });

    it("should be able to correctly modify the specified user's options", function(done) {
       this.db_connection.setOptions({"joueur_concerne": 1, "volume": 0.7, "animations": 0, "language": "fr"}).then(() => { // Then, after we've modified the options, we check if they have been updated in the database
           this.db_connection.getOptions(1).then((options) => {
               expect(options.animations).toEqual(0);
               expect(options.volume).toEqual(0.7);

               done();
           });
       });
    });

    afterAll(function(done) {
        this.db_connection.setOptions({"joueur_concerne": 1, "volume": .5, "animations": 1}).then(() => {
            done();
        })
    })
});

describe("createOptions", function() {
   beforeEach(function(done) { // First, we have to create a new user (which will be deleted in the afterAll)
       this.db_connection = new DatabaseConnection();

       this.db_connection.createUser({"username": "utilisateurdetest3", "password": "monutilisateurdetest"}).then((userInfo) => {
           this.user_id = userInfo.id; // Needed as a parameter of the createOptions function
           this.language = "fr";

           done();

       }).catch((err) => {
         console.log(err);
       });
   });

    it("should correctly insert the options of a newly-created user", function(done) {
        this.db_connection.createOptions(this.user_id, this.language).then(() => {

            // Then, we check the options of this user
            this.db_connection.getOptions(this.user_id).then((options) => {
                expect(options.joueur_concerne).toEqual(this.user_id);
                expect(options.language).toEqual(this.language);
                done();
            })

        });
    });


    afterEach(function(done) {
        this.db_connection.removeLastOptions("utilisateurdetest3").then(() => {
            this.db_connection.removeUser("utilisateurdetest3").then(() => {
              done();
            })
        });

    })
});

/* Utility functions */
describe("generateNewMatchQuery", function() {
   beforeAll(function() {
       this.db_connection = new DatabaseConnection();
       this.game_info = {"winner": 1, "loser": 2, "type": "online", "remaining_hp": 50};
   });

    it("should return the correct request with specified info", function() {

        let query = this.db_connection.generateNewMatchQuery(this.game_info);
        expect(query).toEqual(`INSERT INTO matches VALUES(
                '',
                1,
                2,
                (select id from match_type where match_label="online"),
                50,
                NOW())`);
    });
});

describe("generateConnectionQuery", function() {
    beforeAll(function() {
       this.db_connection = new DatabaseConnection();
       this.params = {"username": "monutilisateurtest"};
   });

    it("should return the correct request with specified data", function() {
        let query = this.db_connection.generateConnectionQuery(this.params);

        expect(query).toEqual(`select
            connexion.username, connexion.password, connexion.id, options.animations, options.volume, options.language
            from options
            left join connexion
            on options.joueur_concerne = connexion.id
            where connexion.username="monutilisateurtest";`);
    })
});

describe("generateUserCreationQuery", function() {
    beforeAll(function() {
        this.db_connection = new DatabaseConnection();
        this.userInfo = {"username": "monutilisateurtest", "password": "monpasswordtest"};

    })

    it("should return the correct request with specified data", function() {
        let query = this.db_connection.generateUserCreationQuery(this.userInfo);

        expect(query).toEqual(`INSERT INTO connexion VALUES (
                    '',
                    'monutilisateurtest',
                    'monpasswordtest',
                    '');`
        );
    });

});

describe("generateUserMatchesQuery", function() {
    beforeAll(function() {
        this.db_connection = new DatabaseConnection();
        this.id = 25;
    })

    it("should return the correct request with specified data", function() {
        let query = this.db_connection.generateUserMatchesQuery(this.id);

        expect(query).toEqual(`SELECT * FROM matches WHERE 25 in (winner, loser)`);
    });

});

describe("generateGetUserId", function() {
    beforeAll(function() {
        this.db_connection = new DatabaseConnection();
        this.userInfo = {"username": "monutilisateurtest"};

    })

    it("should return the correct request with specified data", function() {
        let query = this.db_connection.generateGetUserIdQuery(this.userInfo);

        expect(query).toEqual(`SELECT id from connexion where username="monutilisateurtest";`
        );
    });

});


describe("generateUserProfileQuery", function() {
    beforeAll(function() {
        this.db_connection = new DatabaseConnection();
        this.id = 25;

    })

    it("should return the correct request with specified data", function() {
        let query = this.db_connection.generateUserProfileQuery(this.id);

        expect(query).toEqual(`select username,
                (select count(*) as online_wins from matches where type=2 and 25 in (winner, loser)) as online_matches,
                (select count(*) from matches where winner=25 and type=2) as online_wins,
                (select count(*) from matches where type=3 and 25 in (winner, loser)) as ai_matches,
                (select count(*) from matches where winner=25 and type=3) as ai_wins
                from connexion where id=25;`
        );
    });

})

describe("generateGetOptionsQuery", function() {
    beforeAll(function() {
        this.db_connection = new DatabaseConnection();
        this.id = 25;

    })

    it("should return the correct request with specified data", function() {
        let query = this.db_connection.generateGetOptionsQuery(this.id);

        expect(query).toEqual(`SELECT * from options where joueur_concerne=25;`);
    });

});

describe("generateSetOptionsQuery", function() {
    beforeAll(function() {
        this.db_connection = new DatabaseConnection();
        this.info = {"animations": 1, "volume": 0.5, "joueur_concerne": 25, "language": "fr"};
    })

    it("should return the correct request with specified data", function() {
        let query = this.db_connection.generateSetOptionsQuery(this.info);

        expect(query).toEqual(`UPDATE options set animations=1, volume=0.5, language="fr" where joueur_concerne=25`);
    });

});

describe("generateCreateOptionsQuery", function() {
    beforeAll(function() {
        this.db_connection = new DatabaseConnection();
        this.id = 25;
        this.language = "en"
    })

    it("should return the correct request with specified data", function() {
        let query = this.db_connection.generateCreateOptionsQuery(this.id, this.language);

        expect(query).toEqual(`INSERT INTO options VALUES ('', 25, 1, .5, "en")`);
    });

});
