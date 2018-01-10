# Jeu de plateau Node.js

Ceci est un jeu de plateau permettant à 2 joueurs sur le même écran de combattre. La carte est de taille fixe et ses éléments (position des joueurs, des cases noircies et des armes) sont générés aléatoirement.

## Jeu

Ce repo est une variante d'un projet de jeu plateau multijoueur sur un même client. Le repo du jeu originel se trouve ici : https://github.com/GuiBret/JeuPlateau et le cahier des charges est trouvable ici : https://guillaume-bretzner.com/fr/projets/pjdp (cliquez sur "Cahier des charges" en bas de la page)

Il dispose des fonctionnalités du jeu originel ainsi que certains ajouts : 
* Ajout d'un mode 1 contre 1 en ligne **(fonctionnel)**
* Conservation des victoires et possibilité de connexion **(fonctionnel)**
* Gestion d'options (langue, son, etc.) **(en prévision)**
* Ajout d'un mode versus IA **(en prévision)**
* Présence d'un leaderboard **(en prévision)**


### Tests 

Les tests se trouvent dans le répertoire spec

Pour les tester, utilisez `npm install -g jasmine` puis `jasmine`

Les tests vérifient les éléments suivants : 
- game.spec.js
  - Création d'une partie
  - Gestion du socket de la partie

- grille.spec.js
  - Création de la grille
  - Gestion des déplacements

- database.spec.js
  - Connexions à la base de données
  - Extraction de données des joueurs
  - Ajout de matches dans la DB

- profile.spec.js
  - Récupération du nom et des informations sur les matches (nombre de victoires, de matches, sur quels modes, etc)
  
- requestmanager.spec.js
  - Teste toutes les possibilités de chemin de l'application et le template qu'elles chargent