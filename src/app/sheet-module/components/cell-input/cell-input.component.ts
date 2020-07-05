import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-cell-input',
  templateUrl: './cell-input.component.html',
  styleUrls: ['./cell-input.component.css']
})
export class CellInputComponent implements OnInit {
  @ViewChild('cellInput') cellInput: ElementRef;

  public formula: string;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.cellInput.nativeElement.focus();
  }

}
