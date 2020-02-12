class Composition {
    placement: Map<string, Coordonnees>;
    
    constructor() {
        let placement = new Map<string, Coordonnees>();
    }
    addPlace(hero: string, coordonnees: Coordonnees)   {
        this.placement.set(hero, coordonnees);
    }
    getPlace(hero: string): Coordonnees {
        return this.placement.get(hero);
    }
}