class Coordonnees {
    constructor() {
        this.x = null;
        this.y = null;
    }
    setCoordonnees(x, y) {
        this.x = x;
        this.y = y;
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
}
class Equipement {
    constructor(name, type, propriete, valeur) {
        this.name = name;
        this.type = type;
        this.propriete = propriete;
        this.valeur = valeur;
    }
    getName() {
        return this.name;
    }
    getType() {
        return this.type;
    }
    getPropriete() {
        return this.propriete;
    }
    getValeur() {
        return this.valeur;
    }
}
class Character {
    constructor(name) {
        this.name = name;
        this.attaque = 10;
        this.countAttack = 0;
        this.pdv = 100;
        this.placement = new Coordonnees();
        this.placed = false;
        this.range = 1;
        this.target = null;
        this.direction = null;
        this.vitesse = 1;
        this.lifeBar = null;
    }
    getName() {
        return this.name;
    }
    getAttaque() {
        return this.attaque;
    }
    getPdv() {
        return this.pdv;
    }
    getVitesse() {
        return this.vitesse;
    }
    getRange() {
        return this.range;
    }
    getDirection() {
        return this.direction;
    }
    attacked(attaque) {
        this.pdv = this.pdv - attaque;
        this.redrawLifebar();
        if (this.pdv <= 0) {
            this.pdv = 0;
            this.removeFromBattle();
            dead(this);
        }
    }
    attack(temps) {
        if (this.countAttack < temps) {
            this.target.attacked(this.attaque);
            this.countAttack++;
        }
    }
    setDirection(direction) {
        if (direction != null) {
            switch (direction) {
                case 0:
                    casesArene[this.getPlacement().getX() - 1][this.getPlacement().getY()] = true;
                    break;
                case 1:
                    casesArene[this.getPlacement().getX()][this.getPlacement().getY() - 1] = true;
                    break;
                case 2:
                    casesArene[this.getPlacement().getX() + 1][this.getPlacement().getY()] = true;
                    break;
                case 3:
                    casesArene[this.getPlacement().getX()][this.getPlacement().getY() + 1] = true;
                    break;
            }
            casesArene[this.getPlacement().getX()][this.getPlacement().getY()] = false;
        }
        if (direction != null && direction < 0)
            direction = 3;
        if (direction != null && direction > 3)
            direction = 0;
        this.direction = direction;
    }
    setPlacement(x, y) {
        if (this.placed == false)
            casesArene[x][y] = true;
        alert("x : " + x + "y : " + y);
        this.placed = true;
        this.placement.setCoordonnees(x, y);
        this.redrawLifebar();
    }
    removeFromBattle() {
        this.placed = false;
        this.direction = null;
        this.target = null;
        casesArene[this.getPlacement().getX()][this.getPlacement().getY()] = false;
    }
    getPlacement() {
        return this.placement;
    }
    setTarget(character) {
        this.target = character;
    }
    getTarget() {
        return this.target;
    }
    isInRange() {
        return this.finalDestination(this.getPlacement().getX(), this.getPlacement().getY());
    }
    finalDestination(x, y) {
        switch (this.getTarget().getDirection()) {
            case null:
                if ((Math.abs(x - this.getTarget().getPlacement().getX()) + Math.abs(y - this.getTarget().getPlacement().getY())) <= this.getRange())
                    return true;
                break;
            case 0:
                if ((Math.abs(x - (this.getTarget().getPlacement().getX() - 1)) + Math.abs(y - this.getTarget().getPlacement().getY())) <= this.getRange())
                    return true;
                break;
            case 1:
                if ((Math.abs(x - this.getTarget().getPlacement().getX()) + Math.abs(y - (this.getTarget().getPlacement().getY() - 1))) <= this.getRange())
                    return true;
                break;
            case 2:
                if ((Math.abs(x - (this.getTarget().getPlacement().getX() + 1)) + Math.abs(y - this.getTarget().getPlacement().getY())) <= this.getRange())
                    return true;
                break;
            case 3:
                if ((Math.abs(x - this.getTarget().getPlacement().getX()) + Math.abs(y - (this.getTarget().getPlacement().getY() + 1))) <= this.getRange())
                    return true;
                break;
        }
        return false;
    }
    initLifeBar(graphics) {
        this.lifeBar = graphics;
        this.redrawLifebar();
    }
    redrawLifebar() {
        if (this.lifeBar != null) {
            this.lifeBar.clear();
            this.lifeBar.fillStyle(0xe66a28, 1);
            this.lifeBar.fillRect(heroespriteMap.get(this.getName()).getTopLeft().x, heroespriteMap.get(this.getName()).getTopLeft().y + 10, heroespriteMap.get(this.getName()).width * (this.pdv / 100), 15);
            this.lifeBar.lineStyle(2, 0xffffff);
            this.lifeBar.strokeRect(heroespriteMap.get(this.getName()).getTopLeft().x, heroespriteMap.get(this.getName()).getTopLeft().y + 10, heroespriteMap.get(this.getName()).width, 15);
            this.lifeBar.setDepth(1);
        }
    }
}
class Hero extends Character {
    constructor(name) {
        super(name);
        this.experience = 0;
        this.level = 0;
    }
    getExperience() {
        return this.experience;
    }
    getLevel() {
        return this.level;
    }
    addExperience(xp) {
        this.experience += xp;
        this.checkLevel();
    }
    checkLevel() {
        if (this.experience >= 100 + this.level * 100) {
            this.level++;
            this.experience = 0;
        }
    }
}
class Ennemy extends Character {
    constructor(name) {
        super(name);
    }
}
class Inventaire {
    constructor() {
        this.population = 0;
        this.heros = [];
        this.equipements = [];
    }
    getPopulation() {
        return this.population;
    }
    getHeros() {
        return this.heros;
    }
    getEquipements() {
        return this.equipements;
    }
    addPopulation(increase) {
        this.population += increase;
    }
    addHero(name) {
        var hero = new Hero(name);
        this.heros.push(hero);
    }
    addEquipement(name, type, propriete, valeur) {
        var equipement = new Equipement(name, type, propriete, valeur);
        this.equipements.push(equipement);
    }
}
class Joueur {
    constructor(name) {
        this.name = name;
        this.inventaire = new Inventaire();
    }
}
const tailleHero = 130;
const xGaucheBas = 150;
const xDroiteBas = 1265;
const xGaucheHaut = 265;
const xDroiteHaut = 1150;
const yHaut = 70;
const yBas = 610;
const reserveHaut = 620;
const reserveBas = 715;
const longeurCaseBase = 110;
const largeurCaseBase = 140;
var currentHero;
var joueur;
var ennemies = [];
var ready = false;
var casesArene;
casesArene = new Array(8);
for (let i = 0; i <= 7; i++) {
    casesArene[i] = new Array(false, false, false, false, false, false);
}
ennemies.push(new Ennemy("groof"));
ennemies.find(e => e.getName().localeCompare("groof") == 0).setPlacement(1, 2);
joueur = new Joueur("Cyrkill");
joueur.inventaire.addHero("beast");
joueur.inventaire.addHero("brigand");
joueur.inventaire.addHero("dwarf");
joueur.inventaire.addHero("elzak");
joueur.inventaire.addHero("ghoul");
joueur.inventaire.addHero("giant");
joueur.inventaire.addHero("goblin");
joueur.inventaire.addHero("goblin_bow");
joueur.inventaire.addHero("grolf");
joueur.inventaire.addHero("hobgoblin");
joueur.inventaire.addHero("lich");
joueur.inventaire.addHero("moriko");
joueur.inventaire.addHero("mummy");
joueur.inventaire.addHero("necromancer");
joueur.inventaire.addHero("skeleton_pirate");
joueur.inventaire.addHero("traveller");
joueur.inventaire.addHero("trog");
joueur.inventaire.addHero("troll");
joueur.inventaire.addHero("werewolf");
joueur.inventaire.addHero("woruc");
joueur.inventaire.addEquipement("apocalyptic sword", "sword", "attaque", 10);
///Chargement de l'inventaire
function chargement() {
    temps = 0;
    ///Suppression des éléments actuels
    removeElements();
    ///Affichage des héros dans la liste
    joueur.inventaire.getHeros().forEach(addElement);
    ennemies.forEach(spawnCharacter);
    ///Affichage des equipements dans la liste
    joueur.inventaire.getEquipements().forEach(addElement);
}
//////drag and drop de la liste sur notre visuel
document.getElementById("visuel").addEventListener('dragover', function (e) {
    e.preventDefault();
});
document.getElementById("visuel").addEventListener('drop', function (e) {
    var hero = joueur.inventaire.getHeros().find(e => e.getName().localeCompare(currentHero) == 0);
    var offsetX = ((xGaucheBas - xGaucheHaut) * (yBas - e.offsetY)) / (yHaut - yBas);
    if (e.offsetX > (xGaucheBas + offsetX) && e.offsetX < (xDroiteBas - offsetX) && e.offsetY > yHaut && e.offsetY < yBas) {
        var largeurCase = ((xDroiteBas - xGaucheBas) - (offsetX * 2)) / 8;
        hero.setPlacement(Math.trunc((e.offsetX - (xGaucheBas + offsetX)) / largeurCase), findY(e.offsetY));
    }
    else if (e.offsetY > reserveHaut && e.offsetY < reserveBas) {
        hero.setPlacement(10, 10);
    }
    spawnCharacter(hero, 0);
});
////////
function findY(offsetY) {
    if (offsetY > 500)
        return 5;
    else if (offsetY > 400)
        return 4;
    else if (offsetY > 310)
        return 3;
    else if (offsetY > 225)
        return 2;
    else if (offsetY > 145)
        return 1;
    else
        return 0;
}
function findCentreY(y) {
    if (y == 5)
        return 555;
    else if (y == 4)
        return 450;
    else if (y == 3)
        return 355;
    else if (y == 2)
        return 270;
    else if (y == 1)
        return 185;
    else if (y == 0)
        return 110;
    else
        return 660;
}
function selection(name) {
    ////gerer les boutons de l'entete
    var elements = document.getElementsByClassName("bouton");
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.width = "25%";
        elements[i].style.height = "80%";
    }
    var element = document.getElementById(name + "-button");
    element.style.width = "50%";
    element.style.height = "100%";
    /////////
    ////gerer l'affichage
    var elementsToHide = document.getElementById('liste').lastElementChild;
    while (elementsToHide) {
        if (elementsToHide.className == name) {
            elementsToHide.style.display = "block";
        }
        else {
            elementsToHide.style.display = "none";
        }
        elementsToHide = elementsToHide.previousElementSibling;
    }
    /////////
}
function removeElements() {
    var elementsTocheck = document.getElementById('liste').lastElementChild;
    while (elementsTocheck) {
        document.getElementById('liste').removeChild(elementsTocheck);
        elementsTocheck = elementsTocheck.previousElementSibling;
    }
}
function addElement(element, index) {
    var newElement = document.createElement('a');
    newElement.draggable = true;
    newElement.style.display = "none";
    var newTextElement;
    if (element instanceof Hero) {
        newElement.className = "heros";
        newElement.addEventListener('dragstart', function (e) {
            e.dataTransfer.setData('text/plain', '');
            currentHero = newElement.textContent;
        });
        newTextElement = document.createTextNode(element.getName());
    }
    else if (element instanceof Equipement) {
        newElement.className = "equipements";
        newTextElement = document.createTextNode(element.getName() + ' : ' + element.getType() + "  +" + element.getValeur() + ' ' + element.getPropriete());
    }
    newElement.appendChild(newTextElement);
    document.getElementById('liste').appendChild(newElement);
}
function fight() {
    if (ready == false) {
        // heroespriteMap.forEach(e => e.setVisible(true));
        ennemies.filter(e => e.placed == true).forEach(e => e.initLifeBar(scene.add.graphics()));
        joueur.inventaire.getHeros().filter(e => e.placed == true).forEach(e => e.initLifeBar(scene.add.graphics()));
        ennemies.filter(e => e.placed == true).forEach(findTarget);
        joueur.inventaire.getHeros().filter(e => e.placed == true).forEach(findTarget);
        ready = true;
    }
    else {
        //reset tout
        //heroespriteMap.forEach(e => e.setVisible(false));
        ennemies.filter(e => e.placed == true).forEach(e => e.removeFromBattle());
        joueur.inventaire.getHeros().filter(e => e.placed == true).forEach(e => e.removeFromBattle());
        ready = false;
    }
}
///<reference path="../../lib/phaser.d.ts"/>
var toucheMenuCombat;
class mainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'mainScene' });
        scene = this;
    }
    preload() {
    }
    create() {
        this.cameras.main.setBounds(0, 0, 3200, 3200);
        var map = this.make.tilemap({ key: 'map' });
        var tiles = map.addTilesetImage('tmw_desert_spacing', 'tiles');
        var layer = map.createStaticLayer(0, tiles, 0, 0);
        player = this.physics.add.sprite(100, 300, 'player');
        cursors = this.input.keyboard.createCursorKeys();
        toucheMenuCombat = this.input.keyboard.addKey('C');
        this.cameras.main.startFollow(player);
    }
    update() {
        const moveAmt = 200;
        player.setDrag(2000);
        if (cursors.right.isDown)
            player.setVelocityX(moveAmt);
        if (cursors.left.isDown)
            player.setVelocityX(-moveAmt);
        if (cursors.up.isDown)
            player.setVelocityY(-moveAmt);
        if (cursors.down.isDown)
            player.setVelocityY(moveAmt);
        if (toucheMenuCombat.isDown) {
            document.getElementById("menucombat").style.display = "block";
            this.scene.start("menuCombatScene");
        }
    }
}
///<reference path="../../lib/phaser.d.ts"/>
var toucheRetour;
var temps;
class menuCombatScene extends Phaser.Scene {
    constructor() {
        super({ key: 'menuCombatScene' });
        scene = this;
    }
    preload() {
    }
    create() {
        this.add.image(0, 0, 'font').setOrigin(0, 0);
        this.add.image(0, 0, 'arene').setOrigin(0, 0);
        toucheRetour = this.input.keyboard.addKey('V');
        chargement();
        ready = false;
    }
    update() {
        if (toucheRetour.isDown) {
            temps = 0;
            document.getElementById("menucombat").style.display = "none";
            this.scene.start("mainScene");
        }
        if (ready == true) {
            temps = temps + 0.02;
            ennemies.filter(e => e.placed == true).forEach(updateCoordonnes);
            joueur.inventaire.getHeros().filter(e => e.placed == true).forEach(updateCoordonnes);
            ennemies.filter(e => e.placed == true).forEach(attack);
            joueur.inventaire.getHeros().filter(e => e.placed == true).forEach(attack);
        }
    }
}
function spawnCharacter(character, index) {
    if (character.getPlacement().getX() != 10) {
        var offsetX = ((xGaucheBas - xGaucheHaut) * (yBas - findCentreY(character.getPlacement().getY()))) / (yHaut - yBas);
        var largeurCase = ((xDroiteBas - xGaucheBas) - (2 * offsetX)) / 8;
        heroespriteMap.set(character.getName(), scene.physics.add.sprite((xGaucheBas + offsetX) + (character.getPlacement().getX() * largeurCase) + (largeurCase / 2), findCentreY(character.getPlacement().getY()) - 20, character.getName()));
        var sprite = heroespriteMap.get(character.getName());
        sprite.setScale(1 - ((5 - character.getPlacement().getY()) * 0.05));
    }
    else
        scene.add.image(120, 460, name);
}
function findTarget(character, index) {
    var found = false;
    var iterator;
    var element;
    var elements;
    if (character.placed == true) {
        if (character instanceof Ennemy) {
            elements = joueur.inventaire.getHeros();
        }
        else if (character instanceof Hero) {
            elements = ennemies;
        }
        ///trouve premier à portée
        element = elements.filter(e => e.placed == true).find(e => (Math.abs(character.getPlacement().getX() - e.getPlacement().getX()) + Math.abs(character.getPlacement().getY() - e.getPlacement().getY())) <= character.getRange());
        //si aucun a portee prend le plus proche
        if (element == undefined)
            element = elements.filter(e => e.placed == true).reduce((selectedTarget, triedTarget) => closerCharacter(selectedTarget, triedTarget, character));
        character.setTarget(element);
        if (character.getTarget() != null) {
            alert(character.getName() + " : " + character.getTarget().getName());
            if (character.isInRange() == false)
                diriger(character, character.getName());
        }
    }
}
function closerCharacter(selectedTarget, triedTarget, currentCharacter) {
    if ((Math.abs(currentCharacter.getPlacement().getX() - triedTarget.getPlacement().getX()) + Math.abs(currentCharacter.getPlacement().getY() - triedTarget.getPlacement().getY())) < (Math.abs(currentCharacter.getPlacement().getX() - selectedTarget.getPlacement().getX()) + Math.abs(currentCharacter.getPlacement().getY() - selectedTarget.getPlacement().getY()))) {
        return triedTarget;
    }
    return selectedTarget;
}
function diriger(character, name) {
    if (character.placed == true && character.getTarget() != null) {
        var offsetX = character.getTarget().getPlacement().getX() - character.getPlacement().getX();
        var offsetY = character.getTarget().getPlacement().getY() - character.getPlacement().getY();
        var directionsInterdites = [false, false, false, false];
        var x = character.getPlacement().getX();
        var y = character.getPlacement().getY();
        ///redirige
        if (character.getDirection() != null) {
            switch (character.getDirection()) {
                case 0:
                    directionsInterdites[2] = true;
                    break;
                case 1:
                    directionsInterdites[3] = true;
                    break;
                case 2:
                    directionsInterdites[0] = true;
                    break;
                case 3:
                    directionsInterdites[1] = true;
                    break;
            }
        }
        ///check les directions interdites
        if (x == 0 || casesArene[x - 1][y] == true) {
            ///la direction est occupee
            directionsInterdites[0] = true;
        }
        if (x == 7 || casesArene[x + 1][y] == true) {
            ///la direction est occupee
            directionsInterdites[2] = true;
        }
        if (y == 0 || casesArene[x][y - 1] == true) {
            ///la direction est occupee
            directionsInterdites[1] = true;
        }
        if (y == 5 || casesArene[x][y + 1] == true) {
            ///la direction est occupee
            directionsInterdites[3] = true;
        }
        /// on assigne une direction
        ///test si sur la meme ligne -> go
        if (offsetX < 0 && directionsInterdites[0] == false) {
            character.setDirection(0);
        }
        else if (offsetX > 0 && directionsInterdites[2] == false) {
            character.setDirection(2);
        }
        ///test si meme colonne -> go
        else if (offsetY > 0 && directionsInterdites[3] == false) {
            character.setDirection(3);
        }
        else if (offsetY < 0 && directionsInterdites[1] == false) {
            character.setDirection(1);
        }
        else {
            // n'a plus de direction ou est bloque par obstacle
            if (character.isInRange() == false) {
                var i = 0;
                while (directionsInterdites[i] == true && i <= 3)
                    i++;
                if (i <= 3)
                    character.setDirection(i);
                else
                    character.setDirection(null);
            }
            else {
                character.setDirection(null);
            }
        }
    }
}
function updateCoordonnes(character, index) {
    var sprite = heroespriteMap.get(character.getName());
    var x = sprite.getCenter().x;
    var y = sprite.getCenter().y;
    var directionsInterdites = [false, false, false, false];
    var cX = character.getPlacement().getX();
    var cY = character.getPlacement().getY();
    var offsetX = ((xGaucheBas - xGaucheHaut) * (yBas - y)) / (yHaut - yBas);
    if (character.getDirection() != null) {
        ///check si la position est dans l'arene
        if (x > (xGaucheBas + offsetX) && x < (xDroiteBas - offsetX) && y > yHaut && y < yBas) {
            var largeurCase = ((xDroiteBas - xGaucheBas) - (offsetX * 2)) / 8;
            ///changement de case
            switch (character.getDirection()) {
                case 0:
                    x = sprite.getRightCenter().x;
                    y = sprite.getRightCenter().y;
                    break;
                case 1:
                    x = sprite.getBottomCenter().x;
                    y = sprite.getBottomCenter().y;
                    break;
                case 2:
                    x = sprite.getLeftCenter().x;
                    y = sprite.getLeftCenter().y;
                    break;
                case 3:
                    x = sprite.getTopCenter().x;
                    y = sprite.getTopCenter().y;
                    break;
            }
            if (cX != Math.trunc((x - (xGaucheBas + offsetX)) / largeurCase) || cY != findY(y)) {
                //on assigne les coordonnees
                character.setPlacement(Math.trunc((x - (xGaucheBas + offsetX)) / largeurCase), findY(y));
                if (character.placed == true && character.getTarget() != null) {
                    if (character.isInRange() == false) {
                        //redirige si besoin
                        diriger(character, name);
                    }
                    else {
                        //attaquer
                        character.setDirection(null);
                        heroespriteMap.get(character.getName()).setVelocity(0);
                    }
                }
            }
            move(character, character.getName());
        }
    }
}
function attack(character, index) {
    if (character.isInRange()) {
        character.attack(temps);
    }
}
function move(character, name) {
    if (character.placed == true) {
        if (character.getDirection() != null) {
            heroespriteMap.get(name).setDrag(2000);
            switch (character.getDirection()) {
                case 0:
                    heroespriteMap.get(name).setVelocityX(-200 * character.getVitesse());
                    break;
                case 1:
                    heroespriteMap.get(name).setVelocityY(-200 * character.getVitesse());
                    break;
                case 2:
                    heroespriteMap.get(name).setVelocityX(200 * character.getVitesse());
                    break;
                case 3:
                    heroespriteMap.get(name).setVelocityY(100 * character.getVitesse());
                    break;
            }
        }
        //si arrete on le positionne correctement
        else {
            let offsetX = ((xGaucheBas - xGaucheHaut) * (yBas - findCentreY(character.getPlacement().getY()))) / (yHaut - yBas);
            let largeurCase = ((xDroiteBas - xGaucheBas) - (2 * offsetX)) / 8;
            heroespriteMap.get(name).setPosition((xGaucheBas + offsetX) + (character.getPlacement().getX() * largeurCase) + (largeurCase / 2), findCentreY(character.getPlacement().getY()) - 20);
        }
    }
}
function dead(character) {
    heroespriteMap.get(character.getName()).destroy();
    if (character instanceof Ennemy) {
        if (ennemies.some(e => e.placed == true))
            joueur.inventaire.getHeros().filter(e => e.getTarget() == this).forEach(findTarget);
        else {
            //plus de combattants adverses
            fight();
            alert("Victoire !!");
        }
    }
    else if (character instanceof Hero) {
        if (ennemies.some(e => e.placed == true))
            ennemies.filter(e => e.getTarget() == this).forEach(findTarget);
        else {
            fight();
            alert("Défaite !!");
        }
    }
}
///<reference path="../../lib/phaser.d.ts"/>
var game;
var scene;
var player;
var cursors;
var controls;
var readyCount;
var heroespriteMap;
window.onload = function () {
    var config = {
        type: Phaser.AUTO,
        width: 1400,
        height: 800,
        parent: 'visuel',
        backgroundColor: '#2d2d2d',
        physics: {
            default: 'arcade',
        },
        pixelArt: true,
        scene: [preloadScene, mainScene, menuCombatScene]
    };
    game = new Phaser.Game(config);
    game.scene.start("preloadScene");
};
class preloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'preloadScene' });
        scene = this;
    }
    preload() {
        // display progress bar
        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 270, 320, 50);
        var width = this.cameras.main.width;
        var height = this.cameras.main.height;
        var loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);
        var percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);
        var assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 50,
            text: '',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        assetText.setOrigin(0.5, 0.5);
        // update progress bar
        this.load.on('progress', function (value) {
            let percentValue = value * 100;
            percentText.setText(percentValue.toString() + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(250, 280, 300 * value, 30);
        });
        // update file progress text
        this.load.on('fileprogress', function (file) {
            assetText.setText('Loading asset: ' + file.key);
        });
        // remove progress bar when complete
        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
        });
        // load assets needed in our game
        heroespriteMap = new Map();
        this.load.image('tiles', './assets/tilemap/tmw_desert_spacing.png');
        this.load.tilemapTiledJSON('map', './assets/tilemap/carte.json');
        this.load.image('player', './assets/tilemap/tank.png');
        this.load.image('arene', './assets/arenes/arene_foudre.png');
        this.load.image('font', './assets/arenes/background4.jpg');
        this.load.image('beast', './assets/heroes/beast.png');
        this.load.image('brigand', './assets/heroes/brigand.png');
        this.load.image('dwarf', './assets/heroes/dwarf.png');
        this.load.image('elzak', './assets/heroes/elzak.png');
        this.load.image('ghoul', './assets/heroes/ghoul.png');
        this.load.image('goblin', './assets/heroes/goblin.png');
        this.load.image('goblin_bow', './assets/heroes/goblin_bow.png');
        this.load.image('grolf', './assets/heroes/grolf.png');
        this.load.image('hobgoblin', './assets/heroes/hobgoblin.png');
        this.load.image('giant', './assets/heroes/giant.png');
        this.load.image('lich', './assets/heroes/lich.png');
        this.load.image('moriko', './assets/heroes/moriko.png');
        this.load.image('mummy', './assets/heroes/mummy.png');
        this.load.image('necromancer', './assets/heroes/necromancer.png');
        this.load.image('skeleton_pirate', './assets/heroes/skeleton_pirate.png');
        this.load.image('traveller', './assets/heroes/traveller.png');
        this.load.image('trog', './assets/heroes/trog.png');
        this.load.image('troll', './assets/heroes/troll.png');
        this.load.image('werewolf', './assets/heroes/werewolf.png');
        this.load.image('woruc', './assets/heroes/woruc.png');
        this.load.image('groof', './assets/heroes/woruc.png');
    }
    create() {
        game.scene.start("mainScene");
    }
    update() {
    }
}
//# sourceMappingURL=bundle.js.map