const DatabaseConnection = require("../node_modules/jeu-backend/utils/database_connection");


describe("Profile info", function() {
   beforeAll(function(done) {
       
           this.db_connection = new DatabaseConnection();
           this.results = {};
           
           this.db_connection.getUserProfileInfo(1).then((res) => {
               this.results = res;
               
               done();     
           });
       });
       
       it("should contain the right name", function() {
           expect(this.results.username).toEqual("usertest");
       });
       
       it("should contain the right number of online matches (2)", function() {
           expect(this.results.online_matches).toEqual(2);
       });
       
       it("should contain the right number of online wins (2)", function() {
           expect(this.results.online_wins).toEqual(2);
       })
       
       it("should contain the right number of AI matches (0)", function() {
           expect(this.results.ai_matches).toEqual(0);
       })
       
       it("should contain the right number of AI wins (0)", function() {
           expect(this.results.ai_wins).toEqual(0);
       })
       
    
});
