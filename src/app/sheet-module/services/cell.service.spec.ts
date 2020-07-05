import { CellService } from "./cell.service";
import { TestBed } from '@angular/core/testing';
import { Cell } from '../models/cell';
import { SheetService } from './sheet.service';

describe('CellService', () => {
  let service: CellService;
  let sheetService: SheetService
  
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CellService);
    sheetService = TestBed.inject(SheetService);
  });

  describe('updateDisplayValue tests', () => {
    it('should accept undefined', () => {
      let cell = new Cell('A1', '');

      service.updateDisplayValue('1', cell, undefined);
      
      expect(cell.display).toEqual('');
    });

    it('should update display value of root cell', () => {
      let cell = new Cell('A1', '');

      service.updateDisplayValue('1', cell, '=2');
      
      expect(cell.display).toEqual('2');
    });
    
    it('should update display value of dependents', () => {
      // arrange cells
      let cellA1 = new Cell('A1', '');

      let cellB1 = new Cell('B1', '=A1');
      cellB1.dependencies.push(cellA1);
      cellA1.dependents.push(cellB1);

      let cellC1 = new Cell('C1', '=A1');
      cellC1.dependencies.push(cellA1);
      cellA1.dependents.push(cellC1);

      spyOn(sheetService, 'getCell')
        .withArgs('1', 'A1').and.returnValue(cellA1);

      // act
      service.updateDisplayValue('1', cellA1, '=2');
      
      // assert
      expect(cellA1.display).toEqual('2');
      expect(cellB1.display).toEqual('2');
      expect(cellC1.display).toEqual('2');
    });
  });
});