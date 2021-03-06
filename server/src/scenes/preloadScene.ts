///<reference path="../../lib/phaser.d.ts"/>
var game: Phaser.Game;
var player: any;
var cursors: any;
var controls;
var readyCount: number;
var listeheros: HerofromJson[];
var listeEquipement: EquipementFromJson[];
var jsonsize: number = 5; 
var data: any; 
window.onload = function() {
    var config = {
        type: Phaser.AUTO,
        width: 1400,
        height: 800,
        parent: 'visuel',
        backgroundColor: '#2d2d2d',
        physics: {
            default: 'arcade', 
        },
        pixelArt: true,
        scene: [preloadScene, mainScene, menuCombatScene, shopScene]
    };

    game = new Phaser.Game(config);
    game.scene.start("preloadScene");
    
}

class preloadScene extends Phaser.Scene{
    constructor(){
        super({key: 'preloadScene' });
    }
    preload ()
    {
        // display progress bar
        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
         progressBox.fillRect(240, 270, 320, 50);
 
        var width = this.cameras.main.width;
        var height = this.cameras.main.height;
        var loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
            font: '20px monospace',
            fill: '#ffffff'
         }
        });
        loadingText.setOrigin(0.5, 0.5);
 
        var percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: '0%',
            style: {
            font: '18px monospace',
            fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);
 
        var assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 50,
            text: '',
            style: {
            font: '18px monospace',
            fill: '#ffffff'
            }
        });
        assetText.setOrigin(0.5, 0.5);
 
        // update progress bar
        this.load.on('progress', function (value: number) {
            let percentValue = value * 100;
            percentText.setText(percentValue.toString() + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(250, 280, 300 * value, 30);
        });
 
        // update file progress text
        this.load.on('fileprogress', function (file: any) {
            assetText.setText('Loading asset: ' + file.key);
        });
 
        // remove progress bar when complete
        this.load.on('complete', function () {
         progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
        });
 
        // load assets needed in our game
        this.load.json('herodata', './assets/Heroes.json');
        this.load.tilemapTiledJSON('map', './assets/tilemap/carte.json');
        this.load.image('tiles', './assets/tilemap/tmw_desert_spacing.png');
        this.load.image('shop', './assets/tilemap/Shop/shopicon.png')
        this.load.image('shopbackground','./assets/tilemap/Shop/shopbackground.jpg');
        this.load.image('player', './assets/tilemap/tank.png');

        this.load.image('arene','./assets/arenes/arene_foudre.png');
        this.load.image('font','./assets/arenes/background4.jpg');
        this.load.image('beast','./assets/heroes/beast.png');
        this.load.image('brigand','./assets/heroes/brigand.png');
        this.load.image('dwarf','./assets/heroes/dwarf.png');
        this.load.image('elzak','./assets/heroes/elzak.png');
        this.load.image('ghoul','./assets/heroes/ghoul.png');
        this.load.image('goblin','./assets/heroes/goblin.png');
        this.load.image('goblin_bow','./assets/heroes/goblin_bow.png');
        this.load.image('grolf','./assets/heroes/grolf.png');
        this.load.image('hobgoblin','./assets/heroes/hobgoblin.png');
        this.load.image('giant','./assets/heroes/giant.png');
        this.load.image('lich','./assets/heroes/lich.png');
        this.load.image('moriko','./assets/heroes/moriko.png');
        this.load.image('mummy','./assets/heroes/mummy.png');
        this.load.image('necromancer','./assets/heroes/necromancer.png');
        this.load.image('skeleton_pirate','./assets/heroes/skeleton_pirate.png');
        this.load.image('traveller','./assets/heroes/traveller.png');
        this.load.image('trog','./assets/heroes/trog.png');
        this.load.image('troll','./assets/heroes/troll.png');
        this.load.image('werewolf','./assets/heroes/werewolf.png');
        this.load.image('woruc','./assets/heroes/woruc.png');
        this.load.image('groof','./assets/heroes/woruc.png');
        this.load.image('battleaxe','./assets/equipements/battleaxe.png');
        this.load.image('battleaxe2','./assets/equipements/battleaxe2.png');
        this.load.image('battleaxe3','./assets/equipements/battleaxe3.png');
        this.load.image('dagger','./assets/equipements/dagger.png');
        this.load.image('dagger1','./assets/equipements/dagger1.png');
        this.load.image('masse','./assets/equipements/masse.png');
        listeheros = [];   
        listeEquipement = []; 
    }
    
    create ()
    {
        data = this.cache.json.get('herodata');

        // Ajout des objets depuis le fichier JSON dans leur listes respectives
         for (let i = 0; i < jsonsize ; i++){
            listeheros.push(new HerofromJson(data.Heroes[i].name, data.Heroes[i].attaque, data.Heroes[i].pdv, data.Heroes[i].valeur));  
            listeEquipement.push(new EquipementFromJson(data.Equipement[i].name, data.Equipement[i].type, data.Equipement[i].propriete, data.Equipement[i].valeur)); 
           }
           game.scene.start("mainScene");
    }
    update ()
    {
        
    }
    
}