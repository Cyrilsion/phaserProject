class Character {

    private name: string;
    private attaque: number;
    private countAttack: number;
    private pdv: number;
    private placement: Coordonnees;
    public placed: boolean;
    private range: number;
    private target: Character;
    private direction: number;
    private vitesse: number;

    private lifeBar: Phaser.GameObjects.Graphics;

    constructor(name: string) {
        this.name = name;
        this.attaque = 10;
        this.countAttack = 0;
        this.pdv = 100;
        this.placement = new Coordonnees();
        this.placed = false;
        this.range = 1;
        this.target = null;
        this.direction = null;
        this.vitesse = 1;
        this.lifeBar = null;
    }

    getName():string {
        return this.name;
    }
    getAttaque(): number {
        return this.attaque;
    }
    getPdv(): number {
        return this.pdv;
    }
    getVitesse(): number {
        return this.vitesse;
    }
    getRange(): number {
        return this.range;
    }
    getDirection(): number {
        return this.direction;
    }
    attacked(attaque: number) {
        this.pdv = this.pdv - attaque;
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
    setDirection(direction: number) {
        if(direction != null) {
            switch(direction) {
                case 0: casesArene[this.getPlacement().getX() - 1][this.getPlacement().getY()] = true;
                    break;
                case 1: casesArene[this.getPlacement().getX()][this.getPlacement().getY() - 1] = true;
                    break;
                case 2: casesArene[this.getPlacement().getX() + 1][this.getPlacement().getY()] = true;
                    break;
                case 3: casesArene[this.getPlacement().getX() ][this.getPlacement().getY() + 1] = true;
                    break;
            }
            casesArene[this.getPlacement().getX()][this.getPlacement().getY()] = false;
        }
        if(direction != null && direction < 0) direction = 3;
        if(direction != null && direction > 3) direction = 0;
        this.direction = direction;
    }
    setPlacement(x: number, y: number) {
        if(this.placed == false) casesArene[x][y] = true;
        alert("x : " + x + "y : "+ y);
        this.placed = true;
        this.placement.setCoordonnees(x, y);
        this.redrawLifebar();
    }
    removeFromBattle() {
        this.placed = false;
        this.direction = null;
        this.target = null;
        casesArene[this.getPlacement().getX()][this.getPlacement().getY()] = false;
    }
    getPlacement(): Coordonnees {
        return this.placement;
    }
    setTarget(character: Character) {
        this.target = character;
    }
    getTarget(): Character {
        return this.target;
    }
    isInRange(): boolean {
        return this.finalDestination(this.getPlacement().getX(), this.getPlacement().getY());
    }
    finalDestination(x: number, y: number): boolean {
        switch(this.getTarget().getDirection()) {
            case null: if((Math.abs(x - this.getTarget().getPlacement().getX()) + Math.abs(y- this.getTarget().getPlacement().getY())) <= this.getRange()) return true;
                break;
            case 0: if((Math.abs(x - (this.getTarget().getPlacement().getX() - 1)) + Math.abs(y- this.getTarget().getPlacement().getY())) <= this.getRange()) return true;
                break;
            case 1: if((Math.abs(x - this.getTarget().getPlacement().getX()) + Math.abs(y- (this.getTarget().getPlacement().getY() - 1))) <= this.getRange()) return true;
                break;
            case 2: if((Math.abs(x - (this.getTarget().getPlacement().getX() + 1)) + Math.abs(y- this.getTarget().getPlacement().getY())) <= this.getRange()) return true;
                break;
            case 3: if((Math.abs(x - this.getTarget().getPlacement().getX()) + Math.abs(y- (this.getTarget().getPlacement().getY() + 1))) <= this.getRange()) return true;
                break;
        }
        return false;
    }
    initLifeBar(graphics: Phaser.GameObjects.Graphics): void {
        this.lifeBar = graphics;
        this.redrawLifebar();
    }
    private redrawLifebar(): void {
        if(this.lifeBar != null) {
            this.lifeBar.clear();
            this.lifeBar.fillStyle(0xe66a28, 1);
            this.lifeBar.fillRect(
              heroespriteMap.get(this.getName()).getTopLeft().x,
              heroespriteMap.get(this.getName()).getTopLeft().y + 10,
              heroespriteMap.get(this.getName()).width * (this.pdv /100),
              15
            );
            this.lifeBar.lineStyle(2, 0xffffff);
            this.lifeBar.strokeRect(heroespriteMap.get(this.getName()).getTopLeft().x, heroespriteMap.get(this.getName()).getTopLeft().y + 10, heroespriteMap.get(this.getName()).width, 15);
            this.lifeBar.setDepth(1);
        }
       
      }

  }

class Hero extends Character{
    private experience: number;
    private level: number;
    constructor(name: string) {
        super(name);
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

    constructor(name: string)   {
        super(name);
    }

}