const tailleHero: number = 130;
const xGauche: number = 175;
const xDroite: number = 1250;
const yHaut: number = 305;
const yBas: number = 610;
const reserveHaut: number = 620;
const reserveBas: number = 715;
const largeurCase: number = (xDroite - xGauche)/8;
const longueurCase: number = (yBas - yHaut)/3;
var currentHero: string;
///Chargement de l'inventaire
var joueur: Joueur = new Joueur("Cyrkill");
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
document.getElementById("visuel").addEventListener('dragover', function(e) {
    e.preventDefault();
});
document.getElementById("visuel").addEventListener('drop', function(e) {
    var hero = joueur.inventaire.getHeros().get(currentHero);
    if(e.offsetX > xGauche && e.offsetX < xDroite && e.offsetY > yHaut && e.offsetY < yBas)   {
        hero.setPlacement(Math.trunc((e.offsetX - xGauche)/largeurCase), Math.trunc((e.offsetY - yHaut)/longueurCase));
    }
    else if(e.offsetY > reserveHaut && e.offsetY < reserveBas) {
        hero.setPlacement(10, 10);
    }
    spawnHero(hero.getName(), hero.getPlacement().getX(), hero.getPlacement().getY());
})
////////

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

function addElement(element: any, cle: string)   {

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