///<reference path="../../lib/phaser.d.ts"/>
var j = new Joueur("Franst"); 
var shopsize = 5; 
var ItemHero: Phaser.GameObjects.Text[];
var ItemEquipement: Phaser.GameObjects.Text[];
class shopScene extends Phaser.Scene{

    constructor(){
        super({key: "shopScene" });

    }
    preload ()
    {
    	 this.add.image( 700, 400 ,'shopbackground');



    }

    create ()
    {           
    	ItemHero = [];
        ItemEquipement = [];

        var TxtExit = this.add.text(700, 700, 'RETOUR A LA CARTE DU MONDE', { fill: '#FF0000', backgroundColor: '#000000' });
        TxtExit.setInteractive();
        TxtExit.on('pointerdown', function() {
            this.scene.stop('shopScene'); 
            this.scene.resume("mainScene");

        }, this);

        this.add.text(150, 75, 'HEROS', { fill: '#0f0', backgroundColor: ' #582900' });

        this.add.text(150, 375, 'EQUIPEMENTS', { fill: '#0f0', backgroundColor: ' #582900' });

        for (let i = 0; i < shopsize; i++){
            ItemHero[i] = this.add.text((150 + (i * 200)), 100, [ listeheros[i].getName(), listeheros[i].getAttaque().toString(), listeheros[i].getPdv().toString(), listeheros[i].getValeur().toString()], { fill: '#0f0', backgroundColor: ' #582900' });

            ItemHero[i].setInteractive();
            ItemHero[i].on('pointerdown', ()=> addElementtoInventory(listeheros[i]));

            ItemEquipement[i] = this.add.text((150 + (i * 200)), 400, [ listeEquipement[i].getName(), listeEquipement[i].getType(), listeEquipement[i].getPropriete(), listeEquipement[i].getValeur().toString()], { fill: '#0f0', backgroundColor: ' #582900' });

            ItemEquipement[i].setInteractive();
            ItemEquipement[i].on('pointerdown', ()=> addElementtoInventory(listeEquipement[i]));
	        }  

              
    }

    update ()
    {
	 //   j.getInventaire().getHeros().forEach((e)=> console.log(e.getName()));

    }

}

 function addElementtoInventory(element: HerofromJson | EquipementFromJson){

 	j.inventaire.addPopulation(1);

 	j.subGold(element.getValeur());

 	if (element instanceof HerofromJson){
 		element.selected = true;
 		alert("Il vous reste" +j.getor()+ "or");
 	}
 	else if (element instanceof EquipementFromJson){
         element.selected = true;
 		alert("Il vous reste" +j.getor()+ "or");
 	}
 }