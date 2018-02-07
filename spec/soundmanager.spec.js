describe("soundmanager init", function() {
    beforeAll(function() {
        this.sm = new SoundManager();
    });
    it('should contain the proper number of sounds', function()  {
        expect(this.sm.sounds.length).toEqual(4);
    });
});


describe("sm.searchSound", function() {
    beforeAll(function() {
        this.sm = new SoundManager();
    });
    it("should get the correct link for a specific ID", function() {
       expect(this.sm.searchSound("WEAPON1")).toEqual("/public/sound/arme1.wav");
    });
});

describe("sm.createSoundList", function() {
    beforeAll(function() {
        this.sm = new SoundManager();
    });
    it("should generate a correct links list for a given ID list", function() {
       let soundList = this.sm.createSoundList(["WEAPON1", "WEAPON2"]);
        
        expect(soundList).toEqual(["/public/sound/arme1.wav", "/public/sound/arme2.wav"]);
        
    });
});

describe("sm.searchSound", function() {
    beforeAll(function() {
        this.sm = new SoundManager();
    });
    it("should get the correct link for a specific ID", function() {
       let sound = this.sm.createSound(["WEAPON1", "DEFENSE"]);
        
    });
});