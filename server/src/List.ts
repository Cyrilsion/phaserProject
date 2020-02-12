class List<T> {
    private items: Array<T>;
    private index: number;

    constructor() {
        this.items = [];
        this.index = 0;
    }

    size(): number {
        return this.items.length;
    }

    add(value: T): void {
        this.items.push(value);
    }

    get(): T {
        return this.items[this.index];
    }
    hasNext(): boolean {
        if (this.index < this.size())
            return true;
        else {
            this.index = 0;
            return false;
        }
    }
    Next() {
        this.index ++;
    }
}