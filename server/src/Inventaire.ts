class Inventaire {
    private population: number;
    private heros: Map<string, Hero>;
    private equipements: Map<string, Equipement>;

    constructor() {
      this.population = 0;
      this.heros = new Map<string, Hero>();
      this.equipements = new Map<string, Equipement>();
    }
    getPopulation(): number {
      return this.population;
    }
    getHeros(): Map<string, Hero> {
      return this.heros;
    }
    getEquipements(): Map<string, Equipement> {
      return this.equipements;
    }
    addPopulation(increase: number) {
      this.population += increase;
    }
    addHero(name: string) {
      var hero: Hero = new Hero(name);
      this.heros.set(name, hero);
    }
    addEquipement(name: string, type: string, propriete: string, valeur: number) {
      var equipement: Equipement = new Equipement(name, type, propriete, valeur);
      this.equipements.set(name, equipement);
    }

  }