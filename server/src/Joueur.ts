class Joueur {
    name: string;
    inventaire: Inventaire;
    composition: Composition;
    
    constructor(name: string, inventaire: Inventaire, composition: Composition) {
        this.name = name;
        this.composition = composition;
        this.inventaire = inventaire;
    }
}