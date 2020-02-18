///<reference path="../../lib/phaser.d.ts"/>
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

	
}

function create ()
{
        
    this.formUtil.scaleToGameW("heros-button", .25);
    this.formUtil.placeElementAt(101, "heros-button");

    this.formUtil.scaleToGameW("equipements-button", .25);
    this.formUtil.placeElementAt(107, "equipements-button");

}
function update ()
{

}