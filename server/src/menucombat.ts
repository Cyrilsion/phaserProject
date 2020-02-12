///Chargement de l'inventaire
var composition: Composition = new Composition();
var inventaire: Inventaire = new Inventaire();
var joueur: Joueur = new Joueur("Cyrkill", inventaire, composition);
joueur.inventaire.addHero("superMack");
/////////

///Affichage de l'inventaire dans la liste
var i: number = 0;
while(inventaire.getHeros().hasNext()) {
    document.getElementById('liste').innerHTML += inventaire.getHeros().get().getName() + '\n';
    inventaire.getHeros().Next();
}
/////////
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

function preload ()
{
    this.load.image('sky', 'assets/sky.png');
	
}

function create ()
{
        
    this.add.image(400, 300, 'sky');


}
function update ()
{

}