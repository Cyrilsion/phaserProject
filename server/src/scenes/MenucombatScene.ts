///<reference path="../../lib/phaser.d.ts"/>
const tailleHero: number = 130;
const xGaucheBas: number = 150;
const xDroiteBas: number = 1265;
const xGaucheHaut: number = 265;
const xDroiteHaut: number = 1150;
const yHaut: number = 70;
const yBas: number = 610;
const reserveHaut: number = 620;
const reserveBas: number = 715;
const reserveGauche: number = 140;
const reserveDroite: number = 1200;
const longeurCaseBase: number = 110;
const largeurCaseBase: number = 140;
var temps: number;
var ennemies: Ennemy[] = [];
var ready: boolean;
var casesArene: boolean[][];
class menuCombatScene extends Phaser.Scene{

    constructor(){
        super({key: 'menuCombatScene' });
    }
    
    preload ()
    {
        this.add.image(0, 0, 'font').setOrigin(0, 0);
        this.add.image(0, 0, 'arene').setOrigin(0, 0);
        casesArene = new Array(8);
        for(let i = 0; i <= 7; i++) {
            casesArene[i] = new Array(false, false, false, false, false, false);
        }

    }
    
    create ()
    {
        ready = false;
        let i: number = 0;
        listeheros.filter(e => e.selected == true).forEach(e => j.inventaire.addHero(new Hero(this, e.getName(), e.getAttaque(), e.getPdv())));
        listeEquipement.filter(e => e.selected == true).forEach(e => j.inventaire.addEquipement(this, 1200, 500, e.getName(), e.getValeur()));
        ennemies.push(new Ennemy(this, 'dwarf', listeheros.find(e => e.getName().localeCompare('dwarf') == 0).getAttaque(), listeheros.find(e => e.getName().localeCompare('dwarf') == 0).getPdv()));
        j.inventaire.getHeros().forEach(e => e.setInteractif(true, this));
        ennemies.forEach(e => e.setInteractif(true, this));
        j.inventaire.getEquipements().forEach(e => e.setInteractif(true, this));
        temps = 0;
        var TxtReady = this.add.text(1250, 650, 'READY', { fill: '#FF0000', backgroundColor: '#000000' });
        TxtReady.setInteractive();
        TxtReady.on('pointerdown', function() {ready = true});
    
    }
    update ()
    {
        j.inventaire.getEquipements().filter(e => e.getOwner() != null).forEach(e => e.setX(e.getOwner().getCenter().x) && e.setY(e.getOwner().getTopCenter().y - 10));
        if(ready == true) {
            temps = temps + 0.02;
            //une fois au debut
            if(temps <= 0.02) {
                //on place definitivement et on enleve le drag and drop
                ennemies.forEach(function(e){
                    e.setCurrentPosition(e.getPlacement().getX(), e.getPlacement().getY());
                    e.placed = true;
                });
                j.inventaire.getHeros().forEach(function(e){
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
            if(ennemies.some(e => e.placed == true && e.getPdv() != 0) == false) {
                j.inventaire.getHeros().forEach(e => e.removeFromBattle());
                ready = false;
                alert("Victoire!!");
                this.scene.start("mainScene");
            } 
            //s'il ne reste plus de heros places en vie
            else if(j.inventaire.getHeros().some(e => e.placed == true && e.getPdv() != 0) == false) {
                ennemies.forEach(e => e.removeFromBattle());
                ready = false;
                alert("Défaite!!");
                this.scene.start("mainScene");
            }

        }
    }

}

function findTarget(character: Character, index: number) {
    var element: Character;
    var elements: Array<Character>;
    if(character.placed == true) {
        if(character instanceof Ennemy) {
            elements = j.inventaire.getHeros();
        }
        else if(character instanceof Hero) {
            elements = ennemies;
        }
        ///trouve premier à portée
        element = elements.filter(e => e.placed == true).find(e => (Math.abs(character.getPosition().getX() - e.getPosition().getX()) + Math.abs(character.getPosition().getY() - e.getPosition().getY())) <= character.getRange());
        //si aucun a portee prend le plus proche
        if(element == undefined && elements.filter(e => e.placed == true).length != 0) element = elements.filter(e => e.placed == true).reduce((selectedTarget, triedTarget) => closerCharacter(selectedTarget, triedTarget, character));
        character.setTarget(element);
        if(character.getTarget() != null) {
            if(character.isInRange(character.getPosition().getX(), character.getPosition().getY()) == false)
            diriger(character, character.getName());
        }
    }
}

function closerCharacter(selectedTarget: Character, triedTarget: Character, currentCharacter: Character): Character {
    if((Math.abs(currentCharacter.getPosition().getX() - triedTarget.getPosition().getX()) + Math.abs(currentCharacter.getPosition().getY() - triedTarget.getPosition().getY())) < (Math.abs(currentCharacter.getPosition().getX() - selectedTarget.getPosition().getX()) + Math.abs(currentCharacter.getPosition().getY() - selectedTarget.getPosition().getY()))  ) {
        return triedTarget;
    }
    return selectedTarget;
}

function diriger(character: Character, name: string) {
    if(character.placed == true && character.getTarget() != null) {
        var offsetX: number = character.getTarget().getPosition().getX() - character.getPosition().getX();
        var offsetY: number = character.getTarget().getPosition().getY() - character.getPosition().getY();
        var directionsInterdites: boolean[] = [false, false, false, false];
        var x = character.getPosition().getX();
        var y = character.getPosition().getY();
        ///redirige
        if(character.getDirection() != null) {
            switch(character.getDirection()) {
                case 0: directionsInterdites[2] = true;
                    break;
                case 1: directionsInterdites[3] = true;
                    break;
                case 2: directionsInterdites[0] = true;
                    break;
                case 3: directionsInterdites[1] = true;
                    break;
            }
        }
            ///check les directions interdites
            if(x == 0 || casesArene[x - 1][y] == true) {
                ///la direction est occupee
                directionsInterdites[0] = true;
            }
            if(x == 7 || casesArene[x + 1][y] == true) {
                ///la direction est occupee
                directionsInterdites[2] = true;
            }
            if(y == 0 || casesArene[x][y - 1] == true) {
                  ///la direction est occupee
                directionsInterdites[1] = true;
            }
            if(y == 5 || casesArene[x][y + 1] == true) {
                 ///la direction est occupee
                directionsInterdites[3] = true;
            }
            /// on assigne une direction
            ///test si sur la meme ligne -> go
            if(offsetX < 0 && directionsInterdites[0] == false)    {
                character.setDirection(0);
            }
            else if(offsetX > 0  && directionsInterdites[2] == false)  {
                character.setDirection(2);
            }
            ///test si meme colonne -> go
            else if(offsetY > 0  && directionsInterdites[3] == false)   {
                character.setDirection(3);
            }
            else if(offsetY < 0  && directionsInterdites[1] == false) {
                character.setDirection(1);
            }
            else{
                // n'a plus de direction ou est bloque par obstacle
                if(character.isInRange(character.getPosition().getX(), character.getPosition().getY()) == false) {
                    var i = 0;
                    while(directionsInterdites[i] == true && i <= 3) i ++;
                    if(i <= 3) character.setDirection(i);
                    else character.setDirection(null);
                }
                else{
                    character.setDirection(null);
                }
                
            }
    }
}

function updateCoordonnes(character: Character, index: number) {
    var x: number = character.getCenter().x; 
    var y: number = character.getCenter().y;
    var cX = character.getPosition().getX();
    var cY = character.getPosition().getY();
    var offsetX = ((xGaucheBas - xGaucheHaut) * (yBas - y))/(yHaut -yBas);
    var changed: boolean = false;
    character.redrawLifebar();
    if(character.getDirection() != null) {
    ///check si la position est dans l'arene et si le perso est tjr en mouvements
    if(x > (xGaucheBas + offsetX) && x < (xDroiteBas - offsetX) && y > yHaut && y < yBas) {
        var largeurCase = ((xDroiteBas - xGaucheBas)  - (offsetX * 2))/8;
        switch(character.getDirection()) {
            case 0: x = character.getRightCenter().x;
                    y = character.getRightCenter().y;
                    if((cX - 1) == Math.trunc((x - (xGaucheBas + offsetX))/largeurCase) && cY == findY(y)) changed = true;
                break;
            case 1: x = character.getBottomCenter().x;
                    y = character.getBottomCenter().y;
                    if(cX == Math.trunc((x - (xGaucheBas + offsetX))/largeurCase) && (cY - 1) == findY(y)) changed = true;
                break;
            case 2: x =character.getLeftCenter().x;
                    y = character.getLeftCenter().y;
                    if((cX + 1) == Math.trunc((x - (xGaucheBas + offsetX))/largeurCase) && cY == findY(y)) changed = true;
                break;
            case 3: x = character.getTopCenter().x;
                    y = character.getTopCenter().y;
                    if(cX == Math.trunc((x - (xGaucheBas + offsetX))/largeurCase) && (cY + 1) == findY(y)) changed = true;
                break;
        }
        ///changement de case
        if(changed == true) {
            //on assigne les coordonnees
            character.setCurrentPosition(Math.trunc((x - (xGaucheBas + offsetX))/largeurCase), findY(y));
            if(character.placed == true && character.getTarget() != null) {
                if(character.isInRange(character.getPosition().getY(), character.getPosition().getY()) == false) {
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
        let offsetX = ((xGaucheBas - xGaucheHaut) * (yBas - findCentreY(character.getPosition().getY())))/(yHaut -yBas);
        let largeurCase = ((xDroiteBas - xGaucheBas) - (2 * offsetX))/8;
        character.setX((xGaucheBas + offsetX) + (character.getPosition().getX() * largeurCase) + (largeurCase/2));
        character.setY( findCentreY(character.getPosition().getY()) - 20);
    }
    
}

function move(character: Character, name: string) {
    if(character.placed == true) {
            character.setDrag(2000);
            switch(character.getDirection()) {
                case 0: character.setVelocityX(-200 * character.getVitesse());
                break;
                case 1: character.setVelocityY(-200 * character.getVitesse());
                break;
                case 2: character.setVelocityX(200 * character.getVitesse());
                break;
                case 3: character.setVelocityY(100 * character.getVitesse());
                break;
            }     
    }
}
function dead(character: Character) {
        if(character instanceof Ennemy) {
            j.inventaire.getHeros().filter(e => e.getTarget() == this).forEach(findTarget);
        }
        else if(character instanceof Hero) {
            ennemies.filter(e => e.getTarget() == this).forEach(findTarget);
        }
        character.removeFromBattle();
}
function findY(offsetY: number): number {
    if(offsetY > 500) return 5;
    else if(offsetY > 400) return 4;
    else if(offsetY > 310) return 3;
    else if(offsetY > 225) return 2;
    else if(offsetY > 145) return 1;
    else  return 0;
}

function findCentreY(y: number): number {
    if(y == 5) return 555;
    else if(y == 4) return 450;
    else if(y == 3) return 355;
    else if(y == 2) return 270;
    else if(y == 1) return 185;
    else if(y == 0) return 110;
    else return 660;
}
