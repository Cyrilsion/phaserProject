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
const largeurCase = 102;
const longueurCase = 75;
const hauteurHero = 130;
const largeurHero = 60;
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
var currentElement;
document.getElementById("visuel").addEventListener('dragover', function (e) {
    e.preventDefault();
});
document.getElementById("visuel").addEventListener('drop', function (e) {
    var hero = joueur.inventaire.getHeros().get(currentHero);
    if (e.offsetX > 115 && e.offsetX < 930 && e.offsetY > 225 && e.offsetY < 450) {
        hero.setPlacement(Math.trunc(e.offsetX / largeurCase), Math.trunc(e.offsetY / longueurCase));
    }
    else if (e.offsetY > 460 && e.offsetY < 530) {
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
var config = {
    type: Phaser.AUTO,
    width: 1600,
    height: 900,
    parent: 'visuel',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
var game = new Phaser.Game(config);
var scene;
function preload() {
    this.load.image('arene', './assets/arenes/arene_foudre.png');
    this.load.image('font', './assets/arenes/background4.jpg');
    this.load.image('beast', './assets/beast.png');
    this.load.image('brigand', './assets/heroes/brigand.png');
    this.load.image('dwarf', './assets/heroes/dwarf.png');
    this.load.image('elzak', './assets/heroes/elzak.png');
    this.load.image('ghoul', './assets/heroes/ghoul.png');
    this.load.image('goblin', './assets/heroes/goblin.png');
    this.load.image('goblin_bow', './assets/heroes/goblin_bow.png');
    this.load.image('grolf', './assets/heroes/grolf.png');
    this.load.image('hobgoblin', './assets/heroes/hobgoblin.png');
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
function create() {
    scene = this;
    this.add.image(0, 0, 'font').setOrigin(0, 0);
    this.add.image(0, 0, 'arene').setOrigin(0, 0);
}
function update() {
}
function spawnHero(name, x, y) {
    if (x != 10)
        scene.add.image(x * largeurCase + largeurHero / 2, y * longueurCase - hauteurHero / 2, name).setOrigin(0, 0);
    else
        scene.add.image(120, 460, name).setOrigin(0, 0);
}
//# sourceMappingURL=bundle.js.map