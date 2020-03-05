///<reference path="../../lib/phaser.d.ts"/>
var toucheRetour: any;
var temps: number;
class menuCombatScene extends Phaser.Scene{

    constructor(){
        super({key: 'menuCombatScene' });
        scene = this;
    }
    
    preload ()
    {
        
    }
    
    create ()
    {
        
        this.add.image(0, 0, 'font').setOrigin(0, 0);
        this.add.image(0, 0, 'arene').setOrigin(0, 0);
        toucheRetour =  this.input.keyboard.addKey('V');
        chargement();
        ready = false;
    
    }
    update ()
    {
        if(toucheRetour.isDown) {
            temps = 0;
            document.getElementById("menucombat").style.display = "none";
            this.scene.start("mainScene");
        }
        if(ready == true) {
            temps = temps + 0.02;
            ennemies.filter(e => e.placed == true).forEach(updateCoordonnes);
            joueur.inventaire.getHeros().filter(e => e.placed == true).forEach(updateCoordonnes);
            ennemies.filter(e => e.placed == true).forEach(attack);
            joueur.inventaire.getHeros().filter(e => e.placed == true).forEach(attack);
        }
    }

}

function spawnCharacter(character: Character, index: number) {
    if(character.getPlacement().getX() != 10){
        var offsetX = ((xGaucheBas - xGaucheHaut) * (yBas - findCentreY(character.getPlacement().getY())))/(yHaut -yBas);
        var largeurCase = ((xDroiteBas - xGaucheBas) - (2 * offsetX))/8;
        heroespriteMap.set(character.getName(), scene.physics.add.sprite((xGaucheBas + offsetX) + (character.getPlacement().getX() * largeurCase) + (largeurCase/2), findCentreY(character.getPlacement().getY()) - 20, character.getName()));
        var sprite = heroespriteMap.get(character.getName());
        sprite.setScale(1 -((5 - character.getPlacement().getY()) * 0.05));
    }
    
    else 
    scene.add.image(120, 460, name);
}

function findTarget(character: Character, index: number) {
    var found: boolean = false;
    var iterator: IterableIterator<Character>; 
    var element: Character;
    var elements: Array<Character>;
    if(character.placed == true) {
        if(character instanceof Ennemy) {
            elements = joueur.inventaire.getHeros();
        }
        else if(character instanceof Hero) {
            elements = ennemies;
        }
        ///trouve premier à portée
        element = elements.filter(e => e.placed == true).find(e => (Math.abs(character.getPlacement().getX() - e.getPlacement().getX()) + Math.abs(character.getPlacement().getY() - e.getPlacement().getY())) <= character.getRange());
        //si aucun a portee prend le plus proche
        if(element == undefined) element = elements.filter(e => e.placed == true).reduce((selectedTarget, triedTarget) => closerCharacter(selectedTarget, triedTarget, character));
        character.setTarget(element);
        if(character.getTarget() != null) {
            alert(character.getName() + " : " + character.getTarget().getName());
            if(character.isInRange() == false)
            diriger(character, character.getName());
        }
    }
}

function closerCharacter(selectedTarget: Character, triedTarget: Character, currentCharacter: Character): Character {
    if((Math.abs(currentCharacter.getPlacement().getX() - triedTarget.getPlacement().getX()) + Math.abs(currentCharacter.getPlacement().getY() - triedTarget.getPlacement().getY())) < (Math.abs(currentCharacter.getPlacement().getX() - selectedTarget.getPlacement().getX()) + Math.abs(currentCharacter.getPlacement().getY() - selectedTarget.getPlacement().getY()))  ) {
        return triedTarget;
    }
    return selectedTarget;
}

function diriger(character: Character, name: string) {
    if(character.placed == true && character.getTarget() != null) {
        var offsetX: number = character.getTarget().getPlacement().getX() - character.getPlacement().getX();
        var offsetY: number = character.getTarget().getPlacement().getY() - character.getPlacement().getY();
        var directionsInterdites: boolean[] = [false, false, false, false];
        var x = character.getPlacement().getX();
        var y = character.getPlacement().getY();
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
                if(character.isInRange() == false) {
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
    var sprite: Phaser.Physics.Arcade.Sprite = heroespriteMap.get(character.getName());
    var x: number = sprite.getCenter().x; 
    var y: number = sprite.getCenter().y;
    var directionsInterdites: boolean[] = [false, false, false, false];
    var cX = character.getPlacement().getX();
    var cY = character.getPlacement().getY();
    var offsetX = ((xGaucheBas - xGaucheHaut) * (yBas - y))/(yHaut -yBas);
    if(character.getDirection() != null) {
    ///check si la position est dans l'arene
    if(x > (xGaucheBas + offsetX) && x < (xDroiteBas - offsetX) && y > yHaut && y < yBas)   {
        var largeurCase = ((xDroiteBas - xGaucheBas)  - (offsetX * 2))/8;
        ///changement de case
        switch(character.getDirection()) {
            case 0: x = sprite.getRightCenter().x;
                    y = sprite.getRightCenter().y;
                break;
            case 1: x = sprite.getBottomCenter().x;
                    y = sprite.getBottomCenter().y;
                break;
            case 2: x =sprite.getLeftCenter().x;
                    y = sprite.getLeftCenter().y;
                break;
            case 3: x = sprite.getTopCenter().x;
                    y = sprite.getTopCenter().y;
                break;
        }
        if(cX != Math.trunc((x - (xGaucheBas + offsetX))/largeurCase) || cY != findY(y)) {
            //on assigne les coordonnees
            character.setPlacement(Math.trunc((x - (xGaucheBas + offsetX))/largeurCase),findY(y));

            if(character.placed == true && character.getTarget() != null) {
                if(character.isInRange() == false) {
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

function attack(character: Character, index: number) {
    if(character.isInRange()) {
        character.attack(temps);
    }
}

function move(character: Character, name: string) {
    if(character.placed == true) {
        if(character.getDirection() != null) {
            heroespriteMap.get(name).setDrag(2000);
            switch(character.getDirection()) {
                case 0: heroespriteMap.get(name).setVelocityX(-200 * character.getVitesse());
                break;
                case 1:  heroespriteMap.get(name).setVelocityY(-200 * character.getVitesse());
                break;
                case 2: heroespriteMap.get(name).setVelocityX(200 * character.getVitesse());
                break;
                case 3: heroespriteMap.get(name).setVelocityY(100 * character.getVitesse());
                break;
            }
        }
        //si arrete on le positionne correctement
        else {
            let offsetX = ((xGaucheBas - xGaucheHaut) * (yBas - findCentreY(character.getPlacement().getY())))/(yHaut -yBas);
            let largeurCase = ((xDroiteBas - xGaucheBas) - (2 * offsetX))/8;
            heroespriteMap.get(name).setPosition((xGaucheBas + offsetX) + (character.getPlacement().getX() * largeurCase) + (largeurCase/2), findCentreY(character.getPlacement().getY()) - 20);
        }
       
    }
}
function dead(character: Character) {
    heroespriteMap.get(character.getName()).destroy();
    if(character instanceof Ennemy) {
        if(ennemies.some(e => e.placed == true))
        joueur.inventaire.getHeros().filter(e => e.getTarget() == this).forEach(findTarget);
        else {
            //plus de combattants adverses
            fight();
            alert("Victoire !!");
        }
    }
    else if(character instanceof Hero) {
        if(ennemies.some(e => e.placed == true))
        ennemies.filter(e => e.getTarget() == this).forEach(findTarget);
        else {
            fight();
            alert("Défaite !!");
        }
    }
}
