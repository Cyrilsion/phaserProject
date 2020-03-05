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
    addHero(name: string) {
      var hero: Hero = new Hero(name);
      this.heros.push(hero);
    }
    addEquipement(name: string, type: string, propriete: string, valeur: number) {
      var equipement: Equipement = new Equipement(name, type, propriete, valeur);
      this.equipements.push(equipement);
    }

  }