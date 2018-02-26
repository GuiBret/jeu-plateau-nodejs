i18n.configure({
    locales: {
        "en": {
            "Machin": "truc",
            "vient d'être créé avec succès": "has been successfully created.",
            "Le compte": "The account",
            "Invité": "Guest",
            // Local game
            "Entrez le nom du joueur 1 : ": "Enter the name for player 1 : ",
            "Entrez le nom du joueur 2 : ": "Enter the name for player 2 : ",
            
            "Attaquer": "Attack",
            "Défendre": "Defend",
            "Revolver": "Revolver",
            "Lance-roquette": "Rocket Launcher",
            "Fusil à pompe": "Shotgun",
            "Fusil": "Rifle"
            
        },
        "fr": {
            "Machin": "truc"
        }
        
    },
    
    globalize:true,
    cookie:sessionStorage.getItem("language")
    
});

i18n.setLocale(sessionStorage.getItem("language")); // Reloads the language for each page (maybe should have used a cookie that I would have put in configure, but easier like that (and doesn't work with sessionStorage))