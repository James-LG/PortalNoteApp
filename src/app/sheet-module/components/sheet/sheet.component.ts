import { Component, OnInit } from '@angular/core';
import { SheetService } from '../../services/sheet.service';
import { Sheet } from '../../models/sheet';
import { Cell } from '../../models/cell';

@Component({
  selector: 'app-sheet',
  templateUrl: './sheet.component.html',
  styleUrls: ['./sheet.component.css']
})
export class SheetComponent implements OnInit {
  public sheet: Sheet;

  public columns: number = 10;
  public rows: number = 30;

  public columnWidths: number[];
  public rowHeights: number[];

  public columnNumbers(): number[] {
    return Array(this.columns).fill(0).map((x,i)=>i+1);
  }

  public rowNumbers(): number[] {
    return Array(this.rows).fill(0).map((x,i)=>i+1);
  }

  constructor(public sheetService: SheetService) { }

  ngOnInit(): void {
    this.sheet = this.sheetService.createSheet('bob');

    this.columnWidths = [];
    for (let i = 0; i < this.columns; i++) {
      this.columnWidths.push(100);
    }

    this.rowHeights = [];
    for (let i = 0; i < this.rows; i++) {
      this.rowHeights.push(20);
    }
  }
}
