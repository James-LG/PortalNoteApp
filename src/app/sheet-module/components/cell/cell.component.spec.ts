import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CellComponent } from './cell.component';
import { CellInputComponent } from '../cell-input/cell-input.component';
import { Cell } from '../../models/cell';

describe('CellComponent', () => {
  let component: CellComponent;
  let fixture: ComponentFixture<CellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CellComponent);
    component = fixture.componentInstance;
    component.cell = new Cell('A1', '=1');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('setEditing', () => {
    it('should set editing value', () => {
      component.editing = false;
      component.setEditing(true);
      expect(component.editing).toEqual(true);
    });
  
    it('should set formula to input value', () => {
      let cellInputFixture = TestBed.createComponent(CellInputComponent);
      component.cellInput = cellInputFixture.componentInstance;

      component.setEditing(true);
      component.cellInput.formula = 'bob';
      component.setEditing(false);

      expect(component.cell.display).toEqual('bob');
    })
  });
  
});
