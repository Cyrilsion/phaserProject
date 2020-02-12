class Inventaire {
    population: number;
    heros: List<Hero>;

    constructor() {
      this.population = 0;
      this.heros = new List<Hero>();
    }
    getPopulation(): number {
      return this.population;
    }
    getHeros(): List<Hero> {
      return this.heros;
    }
    addPopulation(increase: number) {
      this.population += increase;
    }
    addHero(name: string) {
      var hero: Hero = new Hero(name);
      this.heros.add(hero);
    }

  }