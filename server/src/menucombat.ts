const tailleHero: number = 130;
const xGaucheBas: number = 150;
const xDroiteBas: number = 1265;
const xGaucheHaut: number = 265;
const xDroiteHaut: number = 1150;
const yHaut: number = 70;
const yBas: number = 610;
const reserveHaut: number = 620;
const reserveBas: number = 715;
const longeurCaseBase: number = 110;
const largeurCaseBase: number = 140;
var currentHero: string;
var joueur: Joueur;
var ennemies: Ennemy[] = [];
var ready: boolean = false;
var casesArene: boolean[][];
casesArene = new Array(8);
    for(let i = 0; i <= 7; i++) {
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
document.getElementById("visuel").addEventListener('dragover', function(e) {
    e.preventDefault();
});

document.getElementById("visuel").addEventListener('drop', function(e) {
    var hero = joueur.inventaire.getHeros().find(e => e.getName().localeCompare(currentHero) == 0);
    var offsetX = ((xGaucheBas - xGaucheHaut) * (yBas - e.offsetY))/(yHaut -yBas);
    if(e.offsetX > (xGaucheBas + offsetX) && e.offsetX < (xDroiteBas - offsetX) && e.offsetY > yHaut && e.offsetY < yBas)   {
        var largeurCase = ((xDroiteBas - xGaucheBas)  - (offsetX * 2))/8;
        hero.setPlacement(Math.trunc((e.offsetX - (xGaucheBas + offsetX))/largeurCase),findY(e.offsetY));
    }
    else if(e.offsetY > reserveHaut && e.offsetY < reserveBas) {
        hero.setPlacement(10, 10);
    }
    spawnCharacter(hero, 0);
})
////////

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

function selection(name: string) {

    ////gerer les boutons de l'entete
    var elements = document.getElementsByClassName("bouton") as HTMLCollectionOf<HTMLElement>;
    for(var i = 0; i < elements.length; i++)    {
        elements[i].style.width = "25%";
        elements[i].style.height = "80%";
    }
    var element = document.getElementById(name + "-button");
    element.style.width = "50%";
    element.style.height = "100%";
    /////////

    ////gerer l'affichage
    var elementsToHide = document.getElementById('liste').lastElementChild as HTMLElement;
    while(elementsToHide)   {
        if(elementsToHide.className == name)    {
            elementsToHide.style.display = "block";
        }
        else{
            elementsToHide.style.display = "none";
        }
        elementsToHide = elementsToHide.previousElementSibling as HTMLElement;
    }
    /////////
}

function removeElements() {

     var elementsTocheck = document.getElementById('liste').lastElementChild as HTMLElement;
     while(elementsTocheck)  {
         document.getElementById('liste').removeChild(elementsTocheck);
         elementsTocheck = elementsTocheck.previousElementSibling as HTMLElement;
     }

}

function addElement(element: any, index: number)   {
    var newElement = document.createElement('a');
    newElement.draggable = true;
    newElement.style.display = "none";

    var newTextElement: Text;
    if(element instanceof Hero) {
        newElement.className = "heros";
        newElement.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', '');
            currentHero = newElement.textContent;
        });
        newTextElement = document.createTextNode(element.getName());
    }
    else if(element instanceof Equipement)  {
        newElement.className = "equipements";
        newTextElement = document.createTextNode(element.getName() + ' : ' + element.getType() + "  +" + element.getValeur() + ' ' + element.getPropriete());
    }

    newElement.appendChild(newTextElement);
    document.getElementById('liste').appendChild(newElement);

}

function fight(){
    if(ready == false) {
       // heroespriteMap.forEach(e => e.setVisible(true));
        ennemies.filter(e => e.placed == true).forEach(e => e.initLifeBar(scene.add.graphics()));
        joueur.inventaire.getHeros().filter(e => e.placed == true).forEach(e => e.initLifeBar(scene.add.graphics()));
        ennemies.filter(e => e.placed == true).forEach(findTarget);
        joueur.inventaire.getHeros().filter(e => e.placed == true).forEach(findTarget);
        ready = true;
    }
    else{
        //reset tout
        //heroespriteMap.forEach(e => e.setVisible(false));
        ennemies.filter(e => e.placed == true).forEach(e => e.removeFromBattle());
        joueur.inventaire.getHeros().filter(e => e.placed == true).forEach(e => e.removeFromBattle());
        ready = false;
    }
    
}