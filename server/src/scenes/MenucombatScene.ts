///<reference path="../../lib/phaser.d.ts"/>
var config = {
    type: Phaser.AUTO,
    width: 1600,
    height: 900,
    parent: 'visuel',
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
var scene: any;
function preload ()
{
    this.load.image('arene','./assets/arenes/arene_foudre.png');
    this.load.image('font','./assets/arenes/background4.jpg');
    this.load.image('beast','./assets/beast.png');
    this.load.image('brigand','./assets/heroes/brigand.png');
    this.load.image('dwarf','./assets/heroes/dwarf.png');
    this.load.image('elzak','./assets/heroes/elzak.png');
    this.load.image('ghoul','./assets/heroes/ghoul.png');
    this.load.image('goblin','./assets/heroes/goblin.png');
    this.load.image('goblin_bow','./assets/heroes/goblin_bow.png');
    this.load.image('grolf','./assets/heroes/grolf.png');
    this.load.image('hobgoblin','./assets/heroes/hobgoblin.png');
    this.load.image('moriko','./assets/heroes/moriko.png');
    this.load.image('mummy','./assets/heroes/mummy.png');
    this.load.image('necromancer','./assets/heroes/necromancer.png');
    this.load.image('skeleton_pirate','./assets/heroes/skeleton_pirate.png');
    this.load.image('traveller','./assets/heroes/traveller.png');
    this.load.image('trog','./assets/heroes/trog.png');
    this.load.image('troll','./assets/heroes/troll.png');
    this.load.image('werewolf','./assets/heroes/werewolf.png');
    this.load.image('woruc','./assets/heroes/woruc.png');

}

function create ()
{
    scene = this;
    this.add.image(0, 0, 'font').setOrigin(0, 0);
    this.add.image(0, 0, 'arene').setOrigin(0, 0);

}
function update ()
{

}

function spawnHero(name: string, x: number, y: number) {
    if(x != 10)
    scene.add.image(x * largeurCase + largeurHero/2, y * longueurCase - hauteurHero/2, name).setOrigin(0, 0);
    else 
    scene.add.image(120, 460, name).setOrigin(0, 0);
}