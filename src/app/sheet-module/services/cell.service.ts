import { Injectable } from '@angular/core';
import { FormulaService } from './formula.service';
import { Cell } from '../models/cell';

@Injectable({
  providedIn: 'root'
})
export class CellService {
  private formulaService: FormulaService;

  constructor(formulaService: FormulaService) {
    this.formulaService = formulaService;
  }

  public updateDisplayValue(sheetUuid: string, cell: Cell, newFormula: string) {
    if (newFormula) {
      cell.formula = newFormula;
      cell.display = this.formulaService.getDisplayValue(sheetUuid, cell, newFormula);
    } else {
      cell.formula = '';
      cell.display = '';
    }

    // update all dependents as well
    cell.dependents.forEach(dependent => {
      this.updateDisplayValue(sheetUuid, dependent, dependent.formula);
    });
  }
}