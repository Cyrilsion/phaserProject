class HerofromJson {
    private name: string;
    private attaque: number;
    private pdv: number;
    private level: number;
    private valeur: number; 
    public selected: boolean;

    constructor(name: string,attaque: number, pdv: number, valeur: number) {
        this.name = name;
        this.attaque = attaque;
        this.pdv = pdv;
        this.level = 1;
        this.valeur = valeur;
        this.selected = false;
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
    getLevel(): number {
        return this.level;
    }
    getValeur(): number {
        return this.valeur;
    }
  }