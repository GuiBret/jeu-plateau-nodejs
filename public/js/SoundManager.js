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
            }
        }
    
    }
    
    playSound(arr_sounds) {
        let sound = this.createSound(arr_sounds);
        console.log(sound);
        sound.play();
        
        
    }
    
    createSound(arr_sounds) {
        
        let soundList = this.createSoundList(arr_sounds);
        
        return new Howl({src: soundList, volume:.3})
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
}