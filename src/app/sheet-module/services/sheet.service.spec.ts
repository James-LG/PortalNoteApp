import { TestBed } from '@angular/core/testing';

import { SheetService } from './sheet.service';

describe('SheetService', () => {
  let service: SheetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SheetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createSheetTest', () => {
    it('should create sheet', () => {
      // arrange sheet
      let sheet = service.createSheet('bob');
  
      expect(sheet).toBeTruthy();
    });
  });

  describe('getSheetTest', () => {
    it('should throw FormulaError if sheet not exist', () => {
      expect(() => { service.getSheet('bob'); }).toThrowError();
    });
  
    it('should return sheet if exist', () => {
      // arrange sheet
      let sheet = service.createSheet('bob')
  
      let response = service.getSheet(sheet.uuid);
  
      expect(response).toEqual(sheet);
    });
  })

  describe('getCellTest', () => {
    it('should throw FormulaError if sheet not exist', () => {
      // arrange sheet
      // no sheet

      expect(() => { service.getCell('bob', 'A1'); }).toThrowError();
    });
  
    it('should create cell if not exist', () => {
      // arrange sheet
      let sheet = service.createSheet('bob');
  
      let response1 = service.getCell(sheet.uuid, 'A1');
      expect(response1).toBeTruthy();
  
      let response2 = service.getCell(sheet.uuid, 'A1');
      expect(response2).toEqual(response1);
    });
  });

  describe('indexToLetterTest', () => {
    const testCases = [
      { index: 1, letter: 'A' },
      { index: 2, letter: 'B' },
      { index: 3, letter: 'C' },
      { index: 26, letter: 'Z' },
      { index: 27, letter: 'AA' },
      { index: 28, letter: 'AB' },
      { index: 53, letter: 'BA' },
      { index: 54, letter: 'BB' },
      { index: 78, letter: 'BZ' },
      { index: 79, letter: 'CA' }
    ];

    testCases.forEach((test) => {
      it(`should convert ${test.index} to ${test.letter}`, () => {
        expect(service.indexToLetter(test.index)).toBe(test.letter);
        expect(service.letterToIndex(test.letter)).toBe(test.index);
      });
    });
  });

  describe('getXFromAddress', () => {
    const testCases = [
      { address: 'A1', x: 1, y: 1},
      { address: 'B3', x: 2, y: 3},
      { address: 'C1', x: 3, y: 1},
      { address: 'B2', x: 2, y: 2},
      { address: 'AA1', x: 27, y: 1},
      { address: 'B134', x: 2, y: 134},
      { address: 'AB12', x: 28, y: 12}
    ];

    testCases.forEach((test) => {
      it(`should get ${test.x} from ${test.address}`, () => {
        expect(service.getXFromAddress(test.address)).toBe(test.x);
        expect(service.getYFromAddress(test.address)).toBe(test.y);
      });
    });
  });
});
