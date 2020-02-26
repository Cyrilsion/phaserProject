class Hero {
    private name: string;
    private attaque: number;
    private pdv: number;
    private experience: number;
    private level: number;
    private placement: Coordonnees;

    constructor(name: string) {
        this.name = name;
        this.attaque = 10;
        this.pdv = 100;
        this.experience = 0;
        this.level = 0;
        this.placement = new Coordonnees();
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
    setPlacement(x: number, y: number) {
        this.placement.setCoordonnees(x, y);
    }
    getPlacement(): Coordonnees {
        return this.placement;
    }
  }