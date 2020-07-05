export class Cell {
    address: string;
    formula: string;
    display: string;

    dependents: Cell[];
    dependencies: Cell[];

    constructor(address: string, formula: string) {
        this.address = address;
        this.formula = formula;
        this.display = '';

        this.dependents = [];
        this.dependencies = [];
    }
}
