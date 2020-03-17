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
class Equipement extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, name, valeur) {
        super(scene, x, y, name);
        scene.add.existing(this);
        this.valeur = valeur;
        this.owner = null;
        this.setInteractif(false, scene);
    }
    getValeur() {
        return this.valeur;
    }
    getOwner() {
        return this.owner;
    }
    setInteractif(bool, scene) {
        this.setVisible(bool);
        this.setActive(bool);
        if (bool == true) {
            this.setInteractive();
            scene.input.setDraggable(this, bool);
            this.on('drag', function (pointer, GameObjects, dragX, dragY) {
                this.setX(pointer.x);
                this.setY(pointer.y);
            }, this);
            this.on('dragend', function (pointer, gameObject) {
                let hero = j.inventaire.getHeros().find(e => e.getPlacement().getX() == this.getCoordonnees(pointer.x, pointer.y).getX() && e.getPlacement().getY() == this.getCoordonnees(pointer.x, pointer.y).getY());
                if (hero != undefined) {
                    hero.setEquipement(this);
                    this.owner = hero;
                    this.setScale(0.4);
                }
            }, this);
        }
        else {
            this.disableInteractive();
        }
    }
    getCoordonnees(x, y) {
        let xy = new Coordonnees();
        let offsetX = ((xGaucheBas - xGaucheHaut) * (yBas - y)) / (yHaut - yBas);
        let largeurCase = ((xDroiteBas - xGaucheBas) - (offsetX * 2)) / 8;
        if (x > (xGaucheBas + offsetX) && x < (xDroiteBas - offsetX) && y > yHaut && y < yBas)
            xy.setCoordonnees(Math.trunc((x - (xGaucheBas + offsetX)) / largeurCase), findY(y));
        else
            xy.setCoordonnees(10, j.inventaire.getHeros().length);
        return xy;
    }
}
class Arme extends Equipement {
    constructor(scene, x, y, name, valeur) {
        super(scene, x, y, name, valeur);
    }
}
class Armure extends Equipement {
    constructor(scene, x, y, name, valeur) {
        super(scene, x, y, name, valeur);
    }
}
class EquipementFromJson {
    constructor(name, type, propriete, valeur) {
        this.name = name;
        this.type = type;
        this.propriete = propriete;
        this.valeur = valeur;
        this.selected = false;
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
    getCout() {
        return this.cout;
    }
}
class Character extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, name, attaque, pdv, range, vitesse) {
        super(scene, 200 + (j.inventaire.getHeros().length * 117), 670, name);
        this.scene.physics.world.enableBody(this, 0);
        scene.add.existing(this);
        this.setName(name);
        this.currentPosition = new Coordonnees();
        this.placement = new Coordonnees();
        this.setPlacement(j.inventaire.getHeros().length, 0);
        this.attaque = attaque;
        this.countAttack = 0;
        this.pdv = pdv;
        this.placed = false;
        this.range = range;
        this.target = null;
        this.direction = null;
        this.vitesse = vitesse;
        this.lifeBar = null;
        this.setInteractif(false, scene);
    }
    setInteractif(bool, scene) {
        this.setVisible(bool);
        this.setActive(bool);
        if (bool == true) {
            this.setInteractive();
            scene.input.setDraggable(this, bool);
            this.on('drag', function (pointer, GameObjects, dragX, dragY) {
                this.setX(pointer.x);
                this.setY(pointer.y);
            });
            this.on('dragend', function (pointer, gameObject) {
                this.setPlacement(this.getCoordonnees(pointer.x, pointer.y).getX(), this.getCoordonnees(pointer.x, pointer.y).getY());
            });
        }
        else {
            this.disableInteractive();
        }
    }
    getName() {
        return this.name;
    }
    getDirection() {
        return this.direction;
    }
    getPdv() {
        return this.pdv;
    }
    getRange() {
        return this.range;
    }
    getVitesse() {
        return this.vitesse;
    }
    attacked(attaque) {
        this.pdv = this.pdv - attaque;
        alert(this.pdv);
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
    getCoordonnees(x, y) {
        let xy = new Coordonnees();
        let offsetX = ((xGaucheBas - xGaucheHaut) * (yBas - y)) / (yHaut - yBas);
        let largeurCase = ((xDroiteBas - xGaucheBas) - (offsetX * 2)) / 8;
        if (x > (xGaucheBas + offsetX) && x < (xDroiteBas - offsetX) && y > yHaut && y < yBas)
            xy.setCoordonnees(Math.trunc((x - (xGaucheBas + offsetX)) / largeurCase), findY(y));
        else
            xy.setCoordonnees(10, j.inventaire.getHeros().length);
        return xy;
    }
    setEquipement(element) {
        this.arme = element;
        element.setScale(0.1);
        this.attaque = this.attaque + this.arme.getValeur();
    }
    setDirection(direction) {
        switch (direction) {
            case null:
                casesArene[this.getPosition().getX()][this.getPosition().getY()] = true;
                break;
            case 0:
                casesArene[this.getPosition().getX() - 1][this.getPosition().getY()] = true;
                casesArene[this.getPosition().getX()][this.getPosition().getY()] = false;
                break;
            case 1:
                casesArene[this.getPosition().getX()][this.getPosition().getY() - 1] = true;
                casesArene[this.getPosition().getX()][this.getPosition().getY()] = false;
                break;
            case 2:
                casesArene[this.getPosition().getX() + 1][this.getPosition().getY()] = true;
                casesArene[this.getPosition().getX()][this.getPosition().getY()] = false;
                break;
            case 3:
                casesArene[this.getPosition().getX()][this.getPosition().getY() + 1] = true;
                casesArene[this.getPosition().getX()][this.getPosition().getY()] = false;
                break;
        }
        if (direction != null && direction < 0)
            direction = 3;
        if (direction != null && direction > 3)
            direction = 0;
        this.direction = direction;
    }
    getPlacement() {
        return this.placement;
    }
    setPlacement(x, y) {
        this.placement.setCoordonnees(x, y);
        if (y != 0)
            this.setScale(1 - (5 - this.getPlacement().getY()) * 0.05);
    }
    setCurrentPosition(x, y) {
        if (x >= 0 && x <= 7 && y >= 0 && y <= 7) {
            this.currentPosition.setCoordonnees(x, y);
        }
        this.setScale(1 - (5 - this.getPosition().getY()) * 0.1);
    }
    getPosition() {
        return this.currentPosition;
    }
    setTarget(character) {
        this.target = character;
    }
    getTarget() {
        return this.target;
    }
    removeFromBattle() {
        casesArene[this.getPosition().getX()][this.getPosition().getY()] = false;
        this.placed = false;
        this.countAttack = 0;
        this.direction = null;
        this.target = null;
        this.currentPosition = this.placement;
        this.lifeBar.setVisible(false);
    }
    isInRange(x, y) {
        if (this.getTarget() != null) {
            switch (this.getTarget().getDirection()) {
                case null:
                    if ((Math.abs(x - this.getTarget().getPosition().getX()) + Math.abs(y - this.getTarget().getPosition().getY())) <= this.range)
                        return true;
                    break;
                case 0:
                    if ((Math.abs(x - (this.getTarget().getPosition().getX() - 1)) + Math.abs(y - this.getTarget().getPosition().getY())) <= this.range)
                        return true;
                    break;
                case 1:
                    if ((Math.abs(x - this.getTarget().getPosition().getX()) + Math.abs(y - (this.getTarget().getPosition().getY() - 1))) <= this.range)
                        return true;
                    break;
                case 2:
                    if ((Math.abs(x - (this.getTarget().getPosition().getX() + 1)) + Math.abs(y - this.getTarget().getPosition().getY())) <= this.range)
                        return true;
                    break;
                case 3:
                    if ((Math.abs(x - this.getTarget().getPosition().getX()) + Math.abs(y - (this.getTarget().getPosition().getY() + 1))) <= this.range)
                        return true;
                    break;
            }
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
            this.lifeBar.fillRect(this.getTopLeft().x, this.getTopLeft().y - 30, this.width * (this.pdv / listeheros.find(e => e.getName().localeCompare(this.getName()) == 0).getPdv()) / 2, 15);
            this.lifeBar.lineStyle(2, 0xffffff);
            this.lifeBar.strokeRect(this.getTopLeft().x, this.getTopLeft().y - 30, this.width / 2, 15);
            this.lifeBar.setDepth(1);
        }
    }
}
class Hero extends Character {
    constructor(scene, name, attaque, pdv) {
        super(scene, name, attaque, pdv, 1, 1);
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
    constructor(scene, name, attaque, pdv) {
        super(scene, name, attaque, pdv, 1, 1);
    }
}
class HerofromJson {
    constructor(name, attaque, pdv, valeur) {
        this.name = name;
        this.attaque = attaque;
        this.pdv = pdv;
        this.level = 1;
        this.valeur = valeur;
        this.selected = false;
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
    getLevel() {
        return this.level;
    }
    getValeur() {
        return this.valeur;
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
    addHero(hero) {
        this.heros.push(hero);
    }
    addEquipement(scene, x, y, name, valeur) {
        var equipement = new Equipement(scene, x, y, name, valeur);
        this.equipements.push(equipement);
    }
}
class Joueur {
    constructor(name) {
        this.name = name;
        this.inventaire = new Inventaire();
        this.or = 50;
    }
    getor() {
        return this.or;
    }
    subGold(decrease) {
        this.or -= decrease;
    }
    printInventaire() {
        this.inventaire.getHeros().forEach((e) => console.log(e.getName()));
    }
}
///<reference path="../../lib/phaser.d.ts"/>
///<reference path="../../lib/phaser.d.ts"/>
var toucheMenuCombat;
var toucheouvrirboutique;
var olayer;
var shoplayer;
var bglayer;
class mainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'mainScene' });
    }
    preload() {
    }
    create() {
        this.cameras.main.setBounds(0, 0, 3200, 3200);
        var map = this.make.tilemap({ key: 'map' });
        var tiles = map.addTilesetImage('tmw_desert_spacing', 'tiles');
        var shop = map.addTilesetImage('shopicon', 'shop');
        bglayer = map.createStaticLayer('backgroundlayer', tiles, 0, 0);
        olayer = map.createStaticLayer('obstaclelayer', tiles, 0, 0);
        shoplayer = map.createStaticLayer('shoplayer', shop, 0, 0);
        player = this.physics.add.sprite(100, 200, 'player');
        cursors = this.input.keyboard.createCursorKeys();
        toucheMenuCombat = this.input.keyboard.addKey('C');
        toucheouvrirboutique = this.input.keyboard.addKey('B');
        this.cameras.main.startFollow(player);
        olayer.setCollisionBetween(1, 50);
        this.physics.add.collider(player, olayer);
        this.cache.json.get('herodata');
        shoplayer.setTileIndexCallback(49, function () {
            if (toucheouvrirboutique.isDown) {
                this.scene.pause('mainScene');
                this.scene.launch("shopScene");
            }
        }, this);
        this.physics.add.overlap(player, shoplayer);
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
            this.scene.start("menuCombatScene");
        }
    }
}
///<reference path="../../lib/phaser.d.ts"/>
const tailleHero = 130;
const xGaucheBas = 150;
const xDroiteBas = 1265;
const xGaucheHaut = 265;
const xDroiteHaut = 1150;
const yHaut = 70;
const yBas = 610;
const reserveHaut = 620;
const reserveBas = 715;
const reserveGauche = 140;
const reserveDroite = 1200;
const longeurCaseBase = 110;
const largeurCaseBase = 140;
var temps;
var ennemies = [];
var ready;
var casesArene;
class menuCombatScene extends Phaser.Scene {
    constructor() {
        super({ key: 'menuCombatScene' });
    }
    preload() {
        this.add.image(0, 0, 'font').setOrigin(0, 0);
        this.add.image(0, 0, 'arene').setOrigin(0, 0);
        casesArene = new Array(8);
        for (let i = 0; i <= 7; i++) {
            casesArene[i] = new Array(false, false, false, false, false, false);
        }
    }
    create() {
        ready = false;
        let i = 0;
        listeheros.filter(e => e.selected == true).forEach(e => j.inventaire.addHero(new Hero(this, e.getName(), e.getAttaque(), e.getPdv())));
        listeEquipement.filter(e => e.selected == true).forEach(e => j.inventaire.addEquipement(this, 1200, 500, e.getName(), e.getValeur()));
        ennemies.push(new Ennemy(this, 'dwarf', listeheros.find(e => e.getName().localeCompare('dwarf') == 0).getAttaque(), listeheros.find(e => e.getName().localeCompare('dwarf') == 0).getPdv()));
        j.inventaire.getHeros().forEach(e => e.setInteractif(true, this));
        ennemies.forEach(e => e.setInteractif(true, this));
        j.inventaire.getEquipements().forEach(e => e.setInteractif(true, this));
        temps = 0;
        var TxtReady = this.add.text(1250, 650, 'READY', { fill: '#FF0000', backgroundColor: '#000000' });
        TxtReady.setInteractive();
        TxtReady.on('pointerdown', function () { ready = true; });
    }
    update() {
        j.inventaire.getEquipements().filter(e => e.getOwner() != null).forEach(e => e.setX(e.getOwner().getCenter().x) && e.setY(e.getOwner().getTopCenter().y - 10));
        if (ready == true) {
            temps = temps + 0.02;
            //une fois au debut
            if (temps <= 0.02) {
                //on place definitivement et on enleve le drag and drop
                ennemies.forEach(function (e) {
                    e.setCurrentPosition(e.getPlacement().getX(), e.getPlacement().getY());
                    e.placed = true;
                });
                j.inventaire.getHeros().forEach(function (e) {
                    e.setCurrentPosition(e.getPlacement().getX(), e.getPlacement().getY());
                    e.placed = true;
                });
                //on instancie les barres de vie
                ennemies.filter(e => e.placed == true).forEach(e => e.initLifeBar(this.add.graphics()));
                j.inventaire.getHeros().filter(e => e.placed == true).forEach(e => e.initLifeBar(this.add.graphics()));
                ///on trouve la premiere cible
                ennemies.filter(e => e.placed == true).forEach(findTarget);
                j.inventaire.getHeros().filter(e => e.placed == true).forEach(findTarget);
            }
            ennemies.filter(e => e.placed == true).forEach(updateCoordonnes);
            j.inventaire.getHeros().filter(e => e.placed == true).forEach(updateCoordonnes);
            ennemies.filter(e => e.placed == true && e.isInRange(e.getPosition().getY(), e.getPosition().getY()) == true).forEach(character => character.attack(temps));
            j.inventaire.getHeros().filter(e => e.placed == true && e.isInRange(e.getPosition().getY(), e.getPosition().getY()) == true).forEach(character => character.attack(temps));
            //s'il ne reste plus d'ennemis places en vie
            if (ennemies.some(e => e.placed == true && e.getPdv() != 0) == false) {
                j.inventaire.getHeros().forEach(e => e.removeFromBattle());
                ready = false;
                alert("Victoire!!");
                this.scene.start("mainScene");
            }
            //s'il ne reste plus de heros places en vie
            else if (j.inventaire.getHeros().some(e => e.placed == true && e.getPdv() != 0) == false) {
                ennemies.forEach(e => e.removeFromBattle());
                ready = false;
                alert("Défaite!!");
                this.scene.start("mainScene");
            }
        }
    }
}
function findTarget(character, index) {
    var element;
    var elements;
    if (character.placed == true) {
        if (character instanceof Ennemy) {
            elements = j.inventaire.getHeros();
        }
        else if (character instanceof Hero) {
            elements = ennemies;
        }
        ///trouve premier à portée
        element = elements.filter(e => e.placed == true).find(e => (Math.abs(character.getPosition().getX() - e.getPosition().getX()) + Math.abs(character.getPosition().getY() - e.getPosition().getY())) <= character.getRange());
        //si aucun a portee prend le plus proche
        if (element == undefined && elements.filter(e => e.placed == true).length != 0)
            element = elements.filter(e => e.placed == true).reduce((selectedTarget, triedTarget) => closerCharacter(selectedTarget, triedTarget, character));
        character.setTarget(element);
        if (character.getTarget() != null) {
            if (character.isInRange(character.getPosition().getX(), character.getPosition().getY()) == false)
                diriger(character, character.getName());
        }
    }
}
function closerCharacter(selectedTarget, triedTarget, currentCharacter) {
    if ((Math.abs(currentCharacter.getPosition().getX() - triedTarget.getPosition().getX()) + Math.abs(currentCharacter.getPosition().getY() - triedTarget.getPosition().getY())) < (Math.abs(currentCharacter.getPosition().getX() - selectedTarget.getPosition().getX()) + Math.abs(currentCharacter.getPosition().getY() - selectedTarget.getPosition().getY()))) {
        return triedTarget;
    }
    return selectedTarget;
}
function diriger(character, name) {
    if (character.placed == true && character.getTarget() != null) {
        var offsetX = character.getTarget().getPosition().getX() - character.getPosition().getX();
        var offsetY = character.getTarget().getPosition().getY() - character.getPosition().getY();
        var directionsInterdites = [false, false, false, false];
        var x = character.getPosition().getX();
        var y = character.getPosition().getY();
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
            if (character.isInRange(character.getPosition().getX(), character.getPosition().getY()) == false) {
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
    var x = character.getCenter().x;
    var y = character.getCenter().y;
    var cX = character.getPosition().getX();
    var cY = character.getPosition().getY();
    var offsetX = ((xGaucheBas - xGaucheHaut) * (yBas - y)) / (yHaut - yBas);
    var changed = false;
    character.redrawLifebar();
    if (character.getDirection() != null) {
        ///check si la position est dans l'arene et si le perso est tjr en mouvements
        if (x > (xGaucheBas + offsetX) && x < (xDroiteBas - offsetX) && y > yHaut && y < yBas) {
            var largeurCase = ((xDroiteBas - xGaucheBas) - (offsetX * 2)) / 8;
            switch (character.getDirection()) {
                case 0:
                    x = character.getRightCenter().x;
                    y = character.getRightCenter().y;
                    if ((cX - 1) == Math.trunc((x - (xGaucheBas + offsetX)) / largeurCase) && cY == findY(y))
                        changed = true;
                    break;
                case 1:
                    x = character.getBottomCenter().x;
                    y = character.getBottomCenter().y;
                    if (cX == Math.trunc((x - (xGaucheBas + offsetX)) / largeurCase) && (cY - 1) == findY(y))
                        changed = true;
                    break;
                case 2:
                    x = character.getLeftCenter().x;
                    y = character.getLeftCenter().y;
                    if ((cX + 1) == Math.trunc((x - (xGaucheBas + offsetX)) / largeurCase) && cY == findY(y))
                        changed = true;
                    break;
                case 3:
                    x = character.getTopCenter().x;
                    y = character.getTopCenter().y;
                    if (cX == Math.trunc((x - (xGaucheBas + offsetX)) / largeurCase) && (cY + 1) == findY(y))
                        changed = true;
                    break;
            }
            ///changement de case
            if (changed == true) {
                //on assigne les coordonnees
                character.setCurrentPosition(Math.trunc((x - (xGaucheBas + offsetX)) / largeurCase), findY(y));
                if (character.placed == true && character.getTarget() != null) {
                    if (character.isInRange(character.getPosition().getY(), character.getPosition().getY()) == false) {
                        //redirige si besoin
                        diriger(character, name);
                    }
                    else {
                        //attaquer
                        character.setDirection(null);
                        character.setVelocity(0);
                    }
                }
            }
            move(character, character.getName());
        }
    }
    //immobile
    else {
        let offsetX = ((xGaucheBas - xGaucheHaut) * (yBas - findCentreY(character.getPosition().getY()))) / (yHaut - yBas);
        let largeurCase = ((xDroiteBas - xGaucheBas) - (2 * offsetX)) / 8;
        character.setX((xGaucheBas + offsetX) + (character.getPosition().getX() * largeurCase) + (largeurCase / 2));
        character.setY(findCentreY(character.getPosition().getY()) - 20);
    }
}
function move(character, name) {
    if (character.placed == true) {
        character.setDrag(2000);
        switch (character.getDirection()) {
            case 0:
                character.setVelocityX(-200 * character.getVitesse());
                break;
            case 1:
                character.setVelocityY(-200 * character.getVitesse());
                break;
            case 2:
                character.setVelocityX(200 * character.getVitesse());
                break;
            case 3:
                character.setVelocityY(100 * character.getVitesse());
                break;
        }
    }
}
function dead(character) {
    if (character instanceof Ennemy) {
        j.inventaire.getHeros().filter(e => e.getTarget() == this).forEach(findTarget);
    }
    else if (character instanceof Hero) {
        ennemies.filter(e => e.getTarget() == this).forEach(findTarget);
    }
    character.removeFromBattle();
}
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
///<reference path="../../lib/phaser.d.ts"/>
var game;
var player;
var cursors;
var controls;
var readyCount;
var listeheros;
var listeEquipement;
var jsonsize = 5;
var data;
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
        scene: [preloadScene, mainScene, menuCombatScene, shopScene]
    };
    game = new Phaser.Game(config);
    game.scene.start("preloadScene");
};
class preloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'preloadScene' });
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
        this.load.json('herodata', './assets/Heroes.json');
        this.load.tilemapTiledJSON('map', './assets/tilemap/carte.json');
        this.load.image('tiles', './assets/tilemap/tmw_desert_spacing.png');
        this.load.image('shop', './assets/tilemap/Shop/shopicon.png');
        this.load.image('shopbackground', './assets/tilemap/Shop/shopbackground.jpg');
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
        this.load.image('battleaxe', './assets/equipements/battleaxe.png');
        this.load.image('battleaxe2', './assets/equipements/battleaxe2.png');
        this.load.image('battleaxe3', './assets/equipements/battleaxe3.png');
        this.load.image('dagger', './assets/equipements/dagger.png');
        this.load.image('dagger1', './assets/equipements/dagger1.png');
        this.load.image('masse', './assets/equipements/masse.png');
        listeheros = [];
        listeEquipement = [];
    }
    create() {
        data = this.cache.json.get('herodata');
        // Ajout des objets depuis le fichier JSON dans leur listes respectives
        for (let i = 0; i < jsonsize; i++) {
            listeheros.push(new HerofromJson(data.Heroes[i].name, data.Heroes[i].attaque, data.Heroes[i].pdv, data.Heroes[i].valeur));
            listeEquipement.push(new EquipementFromJson(data.Equipement[i].name, data.Equipement[i].type, data.Equipement[i].propriete, data.Equipement[i].valeur));
        }
        game.scene.start("mainScene");
    }
    update() {
    }
}
///<reference path="../../lib/phaser.d.ts"/>
var j = new Joueur("Franst");
var shopsize = 5;
var ItemHero;
var ItemEquipement;
class shopScene extends Phaser.Scene {
    constructor() {
        super({ key: "shopScene" });
    }
    preload() {
        this.add.image(700, 400, 'shopbackground');
    }
    create() {
        ItemHero = [];
        ItemEquipement = [];
        var TxtExit = this.add.text(700, 700, 'RETOUR A LA CARTE DU MONDE', { fill: '#FF0000', backgroundColor: '#000000' });
        TxtExit.setInteractive();
        TxtExit.on('pointerdown', function () {
            this.scene.stop('shopScene');
            this.scene.resume("mainScene");
        }, this);
        this.add.text(150, 75, 'HEROS', { fill: '#0f0', backgroundColor: ' #582900' });
        this.add.text(150, 375, 'EQUIPEMENTS', { fill: '#0f0', backgroundColor: ' #582900' });
        for (let i = 0; i < shopsize; i++) {
            ItemHero[i] = this.add.text((150 + (i * 200)), 100, [listeheros[i].getName(), listeheros[i].getAttaque().toString(), listeheros[i].getPdv().toString(), listeheros[i].getValeur().toString()], { fill: '#0f0', backgroundColor: ' #582900' });
            ItemHero[i].setInteractive();
            ItemHero[i].on('pointerdown', () => addElementtoInventory(listeheros[i]));
            ItemEquipement[i] = this.add.text((150 + (i * 200)), 400, [listeEquipement[i].getName(), listeEquipement[i].getType(), listeEquipement[i].getPropriete(), listeEquipement[i].getValeur().toString()], { fill: '#0f0', backgroundColor: ' #582900' });
            ItemEquipement[i].setInteractive();
            ItemEquipement[i].on('pointerdown', () => addElementtoInventory(listeEquipement[i]));
        }
    }
    update() {
        //   j.getInventaire().getHeros().forEach((e)=> console.log(e.getName()));
    }
}
function addElementtoInventory(element) {
    j.inventaire.addPopulation(1);
    j.subGold(element.getValeur());
    if (element instanceof HerofromJson) {
        element.selected = true;
        alert("Il vous reste" + j.getor() + "or");
    }
    else if (element instanceof EquipementFromJson) {
        element.selected = true;
        alert("Il vous reste" + j.getor() + "or");
    }
}
//# sourceMappingURL=bundle.js.map