///<reference path="../../lib/phaser.d.ts"/>
var toucheMenuCombat: any;
class mainScene extends Phaser.Scene{

    constructor(){
        super({key: 'mainScene' });
        scene = this;
    }
    preload ()
    {

    }

    create ()
    {
        this.cameras.main.setBounds(0, 0, 3200, 3200);

        var map = this.make.tilemap({ key: 'map' });

        var tiles = map.addTilesetImage('tmw_desert_spacing', 'tiles');

        var layer = map.createStaticLayer(0, tiles, 0, 0);

        player = this.physics.add.sprite(100, 300, 'player'); 

        cursors = this.input.keyboard.createCursorKeys(); 

        toucheMenuCombat = this.input.keyboard.addKey('C');

        this.cameras.main.startFollow(player);    
        
    }

    update ()
    {
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
        if(toucheMenuCombat.isDown) {
            document.getElementById("menucombat").style.display = "block";
            this.scene.start("menuCombatScene");
        }
           
    }

}
