class Equipement extends Phaser.Physics.Arcade.Sprite{
    private valeur: number;
    private owner: Character;
    constructor(scene: Phaser.Scene, x: number, y: number, name: string, valeur: number) {
        super(scene, x, y, name);
        scene.add.existing(this);
        this.valeur = valeur;
        this.owner = null;
        this.setInteractif(false, scene);
    }
    getValeur(): number {
        return this.valeur;
    }
    getOwner(): Character {
        return this.owner;
    }
    setInteractif(bool: boolean, scene: Phaser.Scene) {
        this.setVisible(bool);
        this.setActive(bool);
        if(bool == true) {
            this.setInteractive();
            scene.input.setDraggable(this, bool);
            this.on('drag', function(pointer: any, GameObjects: Character, dragX: number, dragY: number) {
                this.setX(pointer.x);
                this.setY(pointer.y);
            }, this);
            this.on('dragend', function(pointer: any, gameObject: Character) {
                let hero = j.inventaire.getHeros().find(e => e.getPlacement().getX() == this.getCoordonnees(pointer.x, pointer.y).getX() && e.getPlacement().getY() == this.getCoordonnees(pointer.x, pointer.y).getY());
                if(hero != undefined) {
                    hero.setEquipement(this);
                    this.owner = hero;
                    this.setScale(0.4);
                }
            }, this);
        } 
        else {
            this.disableInteractive();
        }
    }
    getCoordonnees(x: number, y: number): Coordonnees {
        let xy = new Coordonnees();
        let offsetX = ((xGaucheBas - xGaucheHaut) * (yBas - y))/(yHaut -yBas);
        let largeurCase = ((xDroiteBas - xGaucheBas)  - (offsetX * 2))/8;
        if(x > (xGaucheBas + offsetX) && x < (xDroiteBas - offsetX) && y > yHaut && y < yBas) xy.setCoordonnees(Math.trunc((x - (xGaucheBas + offsetX))/largeurCase), findY(y));
        else xy.setCoordonnees(10, j.inventaire.getHeros().length);
        return xy;
    }
}
class Arme extends Equipement {

    constructor(scene: Phaser.Scene, x: number, y: number, name: string, valeur: number) {
        super(scene, x, y, name, valeur);
    }

}
class Armure extends Equipement {

    constructor(scene: Phaser.Scene, x: number, y: number, name: string, valeur: number) {
        super(scene, x, y, name, valeur);
    }

}
