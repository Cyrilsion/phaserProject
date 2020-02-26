class Coordonnees{
    private x: number;
    private y: number;
    constructor() {
        this.x = 0;
        this.y = 0;
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