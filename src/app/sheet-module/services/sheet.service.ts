import { v4 as uuid } from 'uuid';

import { Injectable } from '@angular/core';

import { FormulaError } from '../models/formulaError';
import { Sheet } from '../models/sheet';
import { Cell } from '../models/cell';

@Injectable({
  providedIn: 'root'
})
export class SheetService {
  private sheets: Map<string, Sheet>;

  private LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  constructor() {
    this.sheets = new Map<string, Sheet>();
  }

  public getCell(sheetUuid: string, cellAddress: string): Cell {
    if (!this.sheets.has(sheetUuid)) {
      throw new FormulaError('SheetService', `Sheet ${sheetUuid} does not have cell ${cellAddress}.`)
    }

    if (!this.sheets.get(sheetUuid).cells.has(cellAddress)) {
      let cell: Cell = {
        address: cellAddress,
        display: '',
        formula: ''
      };
      this.sheets.get(sheetUuid).cells.set(cellAddress, cell);
    }

    let cell = this.sheets.get(sheetUuid).cells.get(cellAddress);

    return cell;
  }

  public createSheet(sheetName: string): Sheet {
    let sheet: Sheet = {
      uuid: uuid(),
      name: sheetName,
      cells: new Map<string, Cell>()
    };

    this.sheets.set(sheet.uuid, sheet);
    return sheet;
  }

  public getSheet(sheetUuid: string): Sheet {
    if (!this.sheets.has(sheetUuid)) {
      throw new FormulaError('SheetService', `Sheet ${sheetUuid} does not exist.`)
    }

    return this.sheets.get(sheetUuid);
  }

  public indexToLetter(index: number): string {
    let letter: string = '';

    while (index > 0) {
      let div = Math.trunc(index / 26)
      let rem = index % 26

      if (rem === 0) {
        div--;
        rem += 26;
      }

      letter = this.LETTERS[rem - 1] + letter;
      index = div;
    }

    return letter;
  }

  public letterToIndex(letter: string): number {
    let num = 0;
    for (let i = 0; i < letter.length; i++) {
      num += (letter.charCodeAt(letter.length - i - 1) - 64) * Math.pow(26, i);
    }
    return num;
  }

  public getXFromAddress(address: string): number {
    // Get only letters
    let re = /[A-Z]+/
    let letters = address.match(re)[0]

    return this.letterToIndex(letters)
  }

  public getYFromAddress(address: string): number {
    // Get only numbers
    let re = /[0-9]+/
    let numbers = address.match(re)[0]
    return Number(numbers)
  }
}
