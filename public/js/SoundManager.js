class SoundManager {
    constructor() {
        this.sounds = {
            "WEAPON1": {
                "link": "/public/sound/arme1.wav"
            },
            "WEAPON2": {
                "link": "/public/sound/arme2.wav"
            },
            "WEAPON3": {
                "link": "/public/sound/arme3.wav"
            },
            "WEAPON4": {
                "link": "/public/sound/arme4.wav"
            },
            "DEFENSE": {
                "link": "/public/sound/impact.wav"
            },
            "STEPS": {
                "link": "/public/sound/steps.wav"
            },
            "WIN": {
                "link": "/public/sound/win.wav"
            },
            "LOSE": {
                "link": "/public/sound/lose.wav"
            }
        }
    
    }
    
    playSound(arr_sounds) { // FUnction used for generic uses, sounds played once (ex : not the steps, which have to be repeated)
         let sound = this.createSound(arr_sounds);
        sound.play();
        
    }
    
    createSound(arr_sounds) {
        
        let soundList = this.createSoundList(arr_sounds);
        
        return new Howl({src: soundList, volume:.3});
    }
    
    createSoundList(arr_sounds) { // Creates the sound list which will be used to generate the Howl in createSound
        let arr_sound_links = [];
        
        for(let sound of arr_sounds) {
            arr_sound_links.push(this.searchSound(sound));
        }
        
        return arr_sound_links;
    }
    
    
    
    searchSound(sound_id) { // Searches through this.sounds and returns the link, used by searchSoundList
        return this.sounds[sound_id].link;
    }
    
    createStepsSound() {
        let soundList = this.createSoundList(["STEPS"]);
        
        return new Howl({src: soundList, volume:.3, loop:true});
        
    }
    
    createWinSound() {
        let soundList = this.createSoundList(["WIN"]);
        return new Howl({src: soundList, volume:.3});
    }
    
    createLossSound() {
        let soundList = this.createSoundList(["LOSE"]);
        return new Howl({src: soundList, volume:.3});
    }
}