class Inventaire {
    private population: number;
    private heros: Hero[];
    private equipements: Equipement[];

    constructor() {
      this.population = 0;
      this.heros = [];
      this.equipements = [];
    }
    getPopulation(): number {
      return this.population;
    }
    getHeros(): Hero[] {
      return this.heros;
    }
    getEquipements(): Equipement[] {
      return this.equipements;
    }
    addPopulation(increase: number) {
      this.population += increase;
    }
    addHero(hero: Hero) {
      this.heros.push(hero);
    }
    addEquipement(scene: Phaser.Scene, x: number, y: number,name: string, valeur: number) {
      var equipement: Equipement = new Equipement(scene, x, y, name, valeur);
      this.equipements.push(equipement);
    }

  }