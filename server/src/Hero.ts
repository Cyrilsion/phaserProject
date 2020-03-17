class Character extends Phaser.Physics.Arcade.Sprite{

    private attaque: number;
    private countAttack: number;
    private pdv: number;
    private placement: Coordonnees;
    private currentPosition: Coordonnees;
    public placed: boolean;
    private range: number;
    private target: Character;
    private direction: number;
    private vitesse: number;
    private armure: Equipement;
    private arme: Equipement;

    private lifeBar: Phaser.GameObjects.Graphics;

    constructor(scene: Phaser.Scene, name: string, attaque: number, pdv: number, range: number, vitesse: number) {
        super(scene, 200 + (j.inventaire.getHeros().length * 117), 670, name);
        this.scene.physics.world.enableBody(this, 0); 
        scene.add.existing(this);
        this.setName(name);
        this.currentPosition = new Coordonnees();
        this.placement = new Coordonnees();
        this.setPlacement(j.inventaire.getHeros().length, 0);
        this.attaque = attaque;
        this.countAttack = 0;
        this.pdv = pdv;
        this.placed = false;
        this.range = range;
        this.target = null;
        this.direction = null;
        this.vitesse = vitesse;
        this.lifeBar = null;
        this.setInteractif(false, scene);
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
            });
            this.on('dragend', function(pointer: any, gameObject: Character) {
                this.setPlacement(this.getCoordonnees(pointer.x, pointer.y).getX(), this.getCoordonnees(pointer.x, pointer.y).getY())
            });
        } 
        else {
            this.disableInteractive();
        }
    }
    getName():string {
        return this.name;
    }
    getDirection(): number {
        return this.direction;
    }
    getPdv(): number {
        return this.pdv;
    }
    getRange(): number {
        return this.range;
    }
    getVitesse() {
        return this.vitesse;
    }
    attacked(attaque: number) {
        this.pdv = this.pdv - attaque;
        alert(this.pdv);
        this.redrawLifebar();
        if(this.pdv <= 0) {
            this.pdv = 0;
           this.removeFromBattle();
            dead(this);
        }
    }
    attack(temps: number) {
        if(this.countAttack < temps) {
            this.target.attacked(this.attaque);
            this.countAttack ++;
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
    setEquipement(element: Equipement) {
        this.arme = element;
        element.setScale(0.1);
        this.attaque = this.attaque + this.arme.getValeur();
    }
    setDirection(direction: number) {
        switch(direction) {
            case null: casesArene[this.getPosition().getX()][this.getPosition().getY()] = true;
                break;
            case 0: casesArene[this.getPosition().getX() - 1][this.getPosition().getY()] = true;
                    casesArene[this.getPosition().getX()][this.getPosition().getY()] = false;
                break;
            case 1: casesArene[this.getPosition().getX()][this.getPosition().getY() - 1] = true;
                    casesArene[this.getPosition().getX()][this.getPosition().getY()] = false;
                break;
            case 2: casesArene[this.getPosition().getX() + 1][this.getPosition().getY()] = true;
                    casesArene[this.getPosition().getX()][this.getPosition().getY()] = false;
                break;
            case 3: casesArene[this.getPosition().getX()][this.getPosition().getY() + 1] = true;
                    casesArene[this.getPosition().getX()][this.getPosition().getY()] = false;
                break;
        }
        if(direction != null && direction < 0) direction = 3;
        if(direction != null && direction > 3) direction = 0;
        this.direction = direction;
    }
    getPlacement(): Coordonnees {
        return this.placement;
    }
    setPlacement(x: number, y: number) {
            this.placement.setCoordonnees(x, y);
            if(y != 0) this.setScale(1 - (5 - this.getPlacement().getY()) * 0.05);    
    }
    setCurrentPosition(x: number, y: number) {
        if(x >= 0 && x <= 7 && y >= 0 && y <= 7) {
            this.currentPosition.setCoordonnees(x, y);
        }
        this.setScale(1 - (5 - this.getPosition().getY()) * 0.1);
    }
    getPosition(): Coordonnees {
        return this.currentPosition;
    }
    setTarget(character: Character) {
        this.target = character;
    }
    getTarget(): Character {
        return this.target;
    }
    removeFromBattle() {
        casesArene[this.getPosition().getX()][this.getPosition().getY()] = false;
        this.placed = false;
        this.countAttack = 0;
        this.direction = null;
        this.target = null;
        this.currentPosition = this.placement;
        this.lifeBar.setVisible(false);
    }
    isInRange(x: number, y: number): boolean {
        if(this.getTarget() != null) {
            switch(this.getTarget().getDirection()) {
                case null: if((Math.abs(x - this.getTarget().getPosition().getX()) + Math.abs(y- this.getTarget().getPosition().getY())) <= this.range) return true;
                    break;
                case 0: if((Math.abs(x - (this.getTarget().getPosition().getX() - 1)) + Math.abs(y- this.getTarget().getPosition().getY())) <= this.range) return true;
                    break;
                case 1: if((Math.abs(x - this.getTarget().getPosition().getX()) + Math.abs(y- (this.getTarget().getPosition().getY() - 1))) <= this.range) return true;
                    break;
                case 2: if((Math.abs(x - (this.getTarget().getPosition().getX() + 1)) + Math.abs(y- this.getTarget().getPosition().getY())) <= this.range) return true;
                    break;
                case 3: if((Math.abs(x - this.getTarget().getPosition().getX()) + Math.abs(y- (this.getTarget().getPosition().getY() + 1))) <= this.range) return true;
                    break;
            }
        }
        return false;
    }
    initLifeBar(graphics: Phaser.GameObjects.Graphics): void {
        this.lifeBar = graphics;
        this.redrawLifebar();
    }
    public redrawLifebar(): void {
        if(this.lifeBar != null) {
            this.lifeBar.clear();
            this.lifeBar.fillStyle(0xe66a28, 1);
            this.lifeBar.fillRect(
              this.getTopLeft().x,
              this.getTopLeft().y - 30,
              this.width * (this.pdv / listeheros.find(e => e.getName().localeCompare(this.getName()) == 0).getPdv()) /2,
              15
            );
            this.lifeBar.lineStyle(2, 0xffffff);
            this.lifeBar.strokeRect(this.getTopLeft().x, this.getTopLeft().y - 30, this.width /2, 15);
            this.lifeBar.setDepth(1);
        }
       
      }

  }

class Hero extends Character{
    private experience: number;
    private level: number;
    constructor(scene: Phaser.Scene, name: string, attaque: number, pdv: number) {
        super(scene, name, attaque, pdv, 1, 1);
        this.experience = 0;
        this.level = 0;
    }
    getExperience(): number {
        return this.experience;
    }
    getLevel(): number {
        return this.level;
    }
    addExperience(xp: number) {
        this.experience +=xp;
        this.checkLevel();
    }
    checkLevel() {
        if(this.experience >= 100 + this.level * 100) {
            this.level++;
            this.experience = 0;
        }
    }

}

class Ennemy extends Character{

    constructor(scene: Phaser.Scene, name: string, attaque: number, pdv: number) {
        super(scene, name, attaque, pdv, 1, 1);
    }

}