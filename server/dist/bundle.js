class Coordonnees {
    constructor() {
        this.x = 0;
        this.y = 0;
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
class Hero {
    constructor(name) {
        this.name = name;
        this.attaque = 10;
        this.pdv = 100;
        this.experience = 0;
        this.level = 0;
        this.placement = new Coordonnees();
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
    setPlacement(x, y) {
        this.placement.setCoordonnees(x, y);
    }
    getPlacement() {
        return this.placement;
    }
}
class Inventaire {
    constructor() {
        this.population = 0;
        this.heros = new Map();
        this.equipements = new Map();
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
        this.heros.set(name, hero);
    }
    addEquipement(name, type, propriete, valeur) {
        var equipement = new Equipement(name, type, propriete, valeur);
        this.equipements.set(name, equipement);
    }
}
class Joueur {
    constructor(name) {
        this.name = name;
        this.inventaire = new Inventaire();
    }
}
const tailleHero = 130;
const xGauche = 175;
const xDroite = 1250;
const yHaut = 305;
const yBas = 610;
const reserveHaut = 620;
const reserveBas = 715;
const largeurCase = (xDroite - xGauche) / 8;
const longueurCase = (yBas - yHaut) / 3;
var currentHero;
///Chargement de l'inventaire
var joueur = new Joueur("Cyrkill");
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
/////////
///Affichage des héros dans la liste
joueur.inventaire.getHeros().forEach(addElement);
/////////
///Affichage des equipements dans la liste
joueur.inventaire.getEquipements().forEach(addElement);
/////////
//////drag and drop de la liste sur notre visuel
document.getElementById("visuel").addEventListener('dragover', function (e) {
    e.preventDefault();
});
document.getElementById("visuel").addEventListener('drop', function (e) {
    var hero = joueur.inventaire.getHeros().get(currentHero);
    if (e.offsetX > xGauche && e.offsetX < xDroite && e.offsetY > yHaut && e.offsetY < yBas) {
        hero.setPlacement(Math.trunc((e.offsetX - xGauche) / largeurCase), Math.trunc((e.offsetY - yHaut) / longueurCase));
    }
    else if (e.offsetY > reserveHaut && e.offsetY < reserveBas) {
        hero.setPlacement(10, 10);
    }
    spawnHero(hero.getName(), hero.getPlacement().getX(), hero.getPlacement().getY());
});
////////
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
function addElement(element, cle) {
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
        player = this.physics.add.sprite(100, game.config.height / 2, 'player');
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
            game.scene.start("menuCombatScene");
        }
    }
}
///<reference path="../../lib/phaser.d.ts"/>
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
    }
    update() {
        if (toucheMenuCombat.isDown) {
            document.getElementById("menucombat").style.display = "none";
            game.scene.start("mainScene");
        }
    }
}
function spawnHero(name, x, y) {
    if (x != 10)
        scene.add.image(xGauche + (x * largeurCase) + (largeurCase / 2), yHaut + (y * longueurCase) + (longueurCase / 4), name);
    else
        scene.add.image(120, 460, name);
}
///<reference path="../../lib/phaser.d.ts"/>
var game;
var scene;
var player;
var cursors;
var controls;
var readyCount;
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
    }
    create() {
        game.scene.start("mainScene");
    }
    update() {
    }
}
//# sourceMappingURL=bundle.js.map