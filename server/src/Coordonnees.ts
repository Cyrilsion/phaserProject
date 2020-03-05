class Coordonnees{
    private x: number;
    private y: number;
    constructor() {
        this.x = null;
        this.y = null;
    }
    setCoordonnees(x: number, y: number)    {
        this.x = x;
        this.y = y;
    }
    getX(): number {
        return this.x;
    }
    getY(): number {
        return this.y;
    }
}