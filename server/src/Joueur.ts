class Joueur {
    private name: string;
    inventaire: Inventaire;
    
    constructor(name: string) {
        this.name = name;
        this.inventaire = new Inventaire();
    }
}