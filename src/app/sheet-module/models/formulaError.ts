export class FormulaError extends Error {
    constructor(originator: string, message: string) {
        super(originator + ': ' + message);
        this.name = 'FormulaError';
    }
}