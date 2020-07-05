import { Injectable } from '@angular/core';
import { FormulaService } from './formula.service';

@Injectable({
  providedIn: 'root'
})
export class CellService {
  private formulaService: FormulaService;

  constructor(formulaService: FormulaService) {
    this.formulaService = formulaService;
  }
}