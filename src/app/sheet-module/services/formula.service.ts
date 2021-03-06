import { Injectable } from '@angular/core';

import { SheetService } from './sheet.service';
import { Cell } from '../models/cell';
import { FormulaError } from '../models/formulaError';

@Injectable({
  providedIn: 'root'
})
export class FormulaService {

  constructor(private sheetService: SheetService) { }

  public isEquation(input: string): boolean {
    return input.length > 1 && input.startsWith('=');
  }

  // Function to find precedence of operators
  private precedence(op: string): number {
    if (op === '+' || op === '-') {
      return 1
    }
    if (op === '*' || op === '/') {
      return 2
    }
    if (op === '^') {
      return 3
    }
    return 0
  }

  // Function to perform arithmetic operations
  public applyOp (a: number, b: number, op: string): number {
    if (op === '^') {
      return Math.pow(a, b)
    }
    if (op === '+') {
      return a + b
    }
    if (op === '-') {
      return a - b
    }
    if (op === '*') {
      return a * b
    }
    if (op === '/') {
      return a / b
    }
    throw new Error(`${op} is not a valid operator`);
  }

  private getParameters(input: string): string[] {
    let params: string[] = [];
    let braceCount: number = 0;
    let currentParam: string = '';

    for (let i=0; i<input.length; i++) {
      if (braceCount === 1 && input[i] === ',') {
        params.push(currentParam);
        currentParam = '';
      } else {
        if (input[i] === ')') {
          braceCount--;
        }

        if (braceCount > 0) {
          currentParam += input[i];
        }

        if (input[i] === '(') {
          braceCount++;
        }
      }
    }
    params.push(currentParam);

    return params;
  }

  private getFunctionName(input: string, startBraceIndex: number): string {
    let funcName: string = '';
    for (let i=startBraceIndex-1; i>=0; i--) {
      if (!isNaN(Number(input[i])) || [' ', '='].includes(input[i]) || this.precedence(input[i]) > 0) {
        return funcName;
      } else {
        funcName = input[i] + funcName;
      }
    }
    return funcName;
  }

  public getParameterValues(sheetUuid: string, cell: Cell, input: string): number[] {
    if (!isNaN(Number(input))) {
      return [Number(input)];
    }

    let values: number[] = [];
    let dependencies: Cell[] = [];

    if (input.includes(':')) {
      let addresses = input.split(':')

      let x1 = this.sheetService.getXFromAddress(addresses[0])
      let y1 = this.sheetService.getYFromAddress(addresses[0])

      let x2 = this.sheetService.getXFromAddress(addresses[1])
      let y2 = this.sheetService.getYFromAddress(addresses[1])

      let minX: number, maxX: number, minY: number, maxY: number;

      if (x1 < x2) {
        minX = x1
        maxX = x2
      } else {
        minX = x2
        maxX = x1
      }

      if (y1 < y2) {
        minY = y1
        maxY = y2
      } else {
        minY = y2
        maxY = y1
      }

      for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
          let address = this.sheetService.indexToLetter(x) + y.toString();
          let cell = this.sheetService.getCell(sheetUuid, address);
          dependencies.push(cell);
          values.push(Number(cell.display));
        }
      }
    } else {
      let cell = this.sheetService.getCell(sheetUuid, input);
      dependencies.push(cell);
      values.push(Number(cell.display));
    }

    this.recalculateDependencies(cell, dependencies);
    return values;
  }

  private recalculateDependencies(rootCell: Cell, dependencies: Cell[]) {
    // cells that are no longer dependencies for the root cell
    let notFound = rootCell.dependencies.filter(n => !dependencies.includes(n));

    // remove this cell as a dependent from all cells no longer required
    notFound.forEach(c => {
      c.dependents = c.dependents.filter(n => n !== rootCell);
    });

    // cells that are new dependencies for the root cell
    let newFound = dependencies.filter(n => !rootCell.dependencies.includes(n));

    newFound.forEach(c => {
      c.dependents.push(rootCell);
    });

    // set the rootCells dependencies
    rootCell.dependencies = dependencies;
  }

  private sum(sheetUuid: string, rootCell: Cell, params: string[]) {
    let sum: number = 0;

    params.forEach((param) => {
      let numbers = this.getParameterValues(sheetUuid, rootCell, param);
      numbers.forEach((number) => {
        sum += number;
      });
    });

    return sum;
  }

  private avg(sheetUuid: string, rootCell: Cell, params: string[]) {
    let sum = this.sum(sheetUuid, rootCell, params);

    return sum / params.length;
  }

  public applyFunctions(sheetUuid: string, rootCell: Cell, input: string): string {
    let braceCount: number = 0;
    let currentFuncText: string = '';
    let currentFuncName: string = '';

    input = input.replace(/\s/g, '');

    for (let i=0; i<input.length; i++) {
      if (input[i] === '(') {
        if (braceCount === 0) {
          currentFuncName = this.getFunctionName(input, i);
          currentFuncText = currentFuncName;
          this.checkFunctionHasDelimiters(input, i - currentFuncText.length);
        }
        braceCount++;
      }

      if (braceCount > 0) {
        currentFuncText += input[i];
      }

      if (input[i] === ')') {
        braceCount--;

        if (braceCount === 0) {
          
          let params: string[] = this.getParameters(currentFuncText);
          let processedParams: string[] = [];
          params.forEach((param) => {
            processedParams.push(this.applyFunctions(sheetUuid, rootCell, param));
          });

          let val: string = '';
          switch (currentFuncName) {
            case 'SUM':
              val = this.sum(sheetUuid, rootCell, processedParams).toString();
              break;

            case 'AVG':
              val = this.avg(sheetUuid, rootCell, processedParams).toString();
              break;

            default:
              throw Error(`Syntax Error: ${currentFuncName} is not a recognized function`);
          }

          input = input.replace(currentFuncText, val);

          i -= (currentFuncText.length - val.length);

          currentFuncText = '';
        }
      }
    }

    return input;
  }

  public getDisplayValue(sheetUuid: string, rootCell: Cell, formula: string): string {
    if (formula[0] === '=') {
      formula = this.applyFunctions(sheetUuid, rootCell, formula);
      formula = this.resolveValuesForMath(sheetUuid, rootCell, formula);
      formula = this.solveMath(formula).toString();
    }
    
    return formula;
  }

  private checkFunctionHasDelimiters(input: string, index: number) {
    if (index === 0) {
      return;
    }

    if (this.precedence(input[index - 1]) == 0 && !['=', ' ', ','].includes(input[index - 1])) {
      throw new Error(`Syntax error at char ${index}: was expecting delimiter.`);
    }
  }

  private resolveValuesForMath(sheetUuid: string, rootCell: Cell, formula: string): string {
    let pairs: [string, string][] = [];

    // matches all addresses and address ranges
    let re = /([A-Z])\w+(:([A-Z])\w+)?/g;
    let match: RegExpExecArray;
    while ((match = re.exec(formula)) !== null) {
      let values = this.getParameterValues(sheetUuid, rootCell, match[0]);
      if (values.length > 1) {
        throw new FormulaError('FormulaService', 'Math expressions must not have cell ranges');
      }
      pairs.push([match[0], values[0].toString()]);
    }

    pairs.forEach(pair => {
      formula = formula.replace(pair[0], pair[1]);
    });

    return formula;
  }

  public solveMath(input: string): number {
    // stack to store integer values.
    var values = []

    // stack to store operators.
    var ops = []
    var i = 0

    while (i < input.length) {
      // current token is whitespace, skip it
      if (input[i] === ' ' || input[i] === '=') {
        i++
      } else if (input[i] === '(') {
        ops.push(input[i])
        i++
      } else if (!isNaN(Number(input[i]))) {
        let val = 0

        // There may be more than one digit
        while (i < input.length && !isNaN(Number(input[i])) && input[i] !== ' ') {
          val = (val * 10) + parseInt(input[i])
          i++
        }
        values.push(val)
      } else if (input[i] === ')') {
        // Close brace encountered, solve entire brace
        while (ops.length !== 0 && ops[ops.length - 1] !== '(') {
          let val2 = values.pop()
          let val1 = values.pop()
          let op = ops.pop()

          values.push(this.applyOp(val1, val2, op))
        }

        // pop opening brace
        ops.pop()

        i++
      } else {
        // While top of ops has same or greater precedence
        // to current token, which is an operator.
        // Apply operator on top of ops to top two elements in values stack.
        while (ops.length !== 0 && this.precedence(ops[ops.length - 1]) >= this.precedence(input[i])) {
          let val2 = values.pop()
          let val1 = values.pop()
          let op = ops.pop()

          values.push(this.applyOp(val1, val2, op))
        }

        // Push current token to ops.
        ops.push(input[i])

        i++
      }
    }

    // Entire expression has been parsed at this point,
    // apply remaining ops to remaining values.
    while (ops.length !== 0) {
      let val2 = values.pop()
      let val1 = values.pop()
      let op = ops.pop()

      values.push(this.applyOp(val1, val2, op))
    }

    // top of values contains result
    return values[values.length - 1]
  }
}
