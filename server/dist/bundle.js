class Composition {
    constructor() {
        let placement = new Map();
    }
    addPlace(hero, coordonnees) {
        this.placement.set(hero, coordonnees);
    }
    getPlace(hero) {
        return this.placement.get(hero);
    }
}
class Coordonnees {
    constructor(x, y) {
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
class Hero {
    constructor(name) {
        this.name = name;
        this.attaque = 10;
        this.pdv = 100;
        this.experience = 0;
        this.level = 0;
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
}
class Inventaire {
    constructor() {
        this.population = 0;
        this.heros = new List();
    }
    getPopulation() {
        return this.population;
    }
    getHeros() {
        return this.heros;
    }
    addPopulation(increase) {
        this.population += increase;
    }
    addHero(name) {
        var hero = new Hero(name);
        this.heros.add(hero);
    }
}
class Joueur {
    constructor(name, inventaire, composition) {
        this.name = name;
        this.composition = composition;
        this.inventaire = inventaire;
    }
}
class List {
    constructor() {
        this.items = [];
        this.index = 0;
    }
    size() {
        return this.items.length;
    }
    add(value) {
        this.items.push(value);
    }
    get() {
        return this.items[this.index];
    }
    hasNext() {
        if (this.index < this.size())
            return true;
        else {
            this.index = 0;
            return false;
        }
    }
    Next() {
        this.index++;
    }
}
///Chargement de l'inventaire
var composition = new Composition();
var inventaire = new Inventaire();
var joueur = new Joueur("Cyrkill", inventaire, composition);
joueur.inventaire.addHero("superMack");
/////////
///Affichage de l'inventaire dans la liste
var i = 0;
while (inventaire.getHeros().hasNext()) {
    document.getElementById('liste').innerHTML += inventaire.getHeros().get().getName() + '\n';
    inventaire.getHeros().Next();
}
/////////
///<reference path="../../lib/phaser.d.ts"/>
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
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
function preload() {
}
function create() {
    this.formUtil.scaleToGameW("heros-button", .25);
    this.formUtil.placeElementAt(101, "heros-button");
    this.formUtil.scaleToGameW("equipements-button", .25);
    this.formUtil.placeElementAt(107, "equipements-button");
}
function update() {
}
//# sourceMappingURL=bundle.js.map