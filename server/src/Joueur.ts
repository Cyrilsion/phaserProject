class Joueur {
    private name: string;
    public inventaire: Inventaire;
    private or: number;
    
    constructor(name: string) {
        this.name = name;
        this.inventaire = new Inventaire();
        this.or = 50;
    }
    getor():number {
        return this.or;
    }
    subGold(decrease: number) {
        this.or -= decrease;
    }
    printInventaire():void {
        this.inventaire.getHeros().forEach((e) => console.log(e.getName())); 
    }
}