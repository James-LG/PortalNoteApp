import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Cell } from '../../models/cell';
import { CellInputComponent } from '../cell-input/cell-input.component';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css']
})
export class CellComponent implements OnInit {
  @Input() public cell: Cell;
  @ViewChild(CellInputComponent) cellInput: CellInputComponent;

  public editing: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  public setEditing(editing: boolean) {
    if (!editing) {
      this.cell.display = this.cellInput.formula;
    }

    this.editing = editing;
  }
}
