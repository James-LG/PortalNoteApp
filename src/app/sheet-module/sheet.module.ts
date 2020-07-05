import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SheetComponent } from './components/sheet/sheet.component';
import { CellComponent } from './components/cell/cell.component';
import { CellInputComponent } from './components/cell-input/cell-input.component';



@NgModule({
  declarations: [SheetComponent, CellComponent, CellInputComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    SheetComponent
  ]
})
export class SheetModule { }
