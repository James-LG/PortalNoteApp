import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Cell } from '../../models/cell';
import { CellInputComponent } from '../cell-input/cell-input.component';
import { FormulaService } from '../../services/formula.service';
import { CellService } from '../../services/cell.service';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css']
})
export class CellComponent implements OnInit {
  @Input() public cell: Cell;
  @Input() public sheetUuid: string;
  @ViewChild(CellInputComponent) cellInput: CellInputComponent;

  public editing: boolean = false;

  private cellService: CellService;

  constructor(cellService: CellService) {
    this.cellService = cellService;
   }

  ngOnInit(): void {
  }

  public setEditing(editing: boolean) {
    if (!editing) {
      this.cellService.updateDisplayValue(this.sheetUuid, this.cell, this.cellInput.formula);
    }

    this.editing = editing;
  }
}
