///<reference path="../../lib/phaser.d.ts"/>
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
    
    }
    update ()
    {
        if(toucheMenuCombat.isDown) {
            document.getElementById("menucombat").style.display = "none";
            game.scene.start("mainScene");
        }
    }

}

function spawnHero(name: string, x: number, y: number) {
    if(x != 10)
    scene.add.image(xGauche + (x * largeurCase) + (largeurCase/2), yHaut + (y * longueurCase) + (longueurCase/4), name);
    else 
    scene.add.image(120, 460, name);
}