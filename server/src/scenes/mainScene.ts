///<reference path="../../lib/phaser.d.ts"/>
///<reference path="../../lib/phaser.d.ts"/>
var toucheMenuCombat: any;
var toucheouvrirboutique: Phaser.Input.Keyboard.Key;
var olayer: Phaser.Tilemaps.StaticTilemapLayer; 
var shoplayer: Phaser.Tilemaps.StaticTilemapLayer;
var bglayer: Phaser.Tilemaps.StaticTilemapLayer;
class mainScene extends Phaser.Scene{

constructor(){
    super({key: 'mainScene' });

}
preload ()
{
   
}

create ()
{
    this.cameras.main.setBounds(0, 0, 3200, 3200);

    var map = this.make.tilemap({ key: 'map' });

    var tiles = map.addTilesetImage('tmw_desert_spacing', 'tiles');

    var shop = map.addTilesetImage('shopicon', 'shop'); 

 	bglayer = map.createStaticLayer('backgroundlayer',tiles, 0, 0);

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
    
    shoplayer.setTileIndexCallback(49, function() {
        if (toucheouvrirboutique.isDown)
        {
        this.scene.pause('mainScene');
        this.scene.launch("shopScene");
        }
    }, this )

    this.physics.add.overlap(player, shoplayer); 

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
        this.scene.start("menuCombatScene");
    }

}
}