class EquipementFromJson {
    private name: string;
    private type: string;
    private propriete: string;
    private valeur: number;
    private cout: number; 
    public selected: boolean;
    constructor(name: string, type: string, propriete: string, valeur: number) {
        this.name = name;
        this.type = type;
        this.propriete = propriete;
        this.valeur = valeur;
        this.selected = false;
    }
    getName(): string {
        return this.name;
    }
    getType(): string {
        return this.type;
    }
    getPropriete(): string {
        return this.propriete;
    }
    getValeur(): number {
        return this.valeur;
    }
    getCout(): number {
        return this.cout;
    }
  }