class Hero {
    name: string;
    attaque: number;
    pdv: number;
    experience: number;
    level: number;

    constructor(name: string) {
        this.name = name;
        this.attaque = 10;
        this.pdv = 100;
        this.experience = 0;
        this.level = 0;
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
  }