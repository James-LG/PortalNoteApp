import { TestBed } from '@angular/core/testing';

import { FormulaService } from './formula.service';
import { SheetService } from './sheet.service';

describe('FormulaService', () => {
  let sheetService: SheetService;
  let service: FormulaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    sheetService = TestBed.inject(SheetService);
    service = TestBed.inject(FormulaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isEquationTest', function() {
    it('should be true when words start with =', () => {
      expect(service.isEquation('=hi')).toBeTrue();
    });
  
    it('should be false when empty', () => {
      expect(service.isEquation('')).toBeFalse();
    });
  
    it('should be false when only =', () => {
      expect(service.isEquation('=')).toBeFalse();
    });
  });

  describe('applyOpTest', function() {
    const testCases = [
      { x: 5, y: 7, op: '+', result: 12 },
      { x: 5, y: 7, op: '-', result: -2 },
      { x: 5, y: 7, op: '*', result: 35 },
      { x: 20, y: 5, op: '/', result: 4 },
      { x: 5, y: 2, op: '^', result: 25 }
    ]
    testCases.forEach(test => {
      it(`should solve ${test.x} ${test.op} ${test.y} to ${test.result}`, () => {
        expect(service.applyOp(test.x, test.y, test.op)).toBe(test.result);
      });
    });

    it('should throw error if invalid op', () => {
      expect(() => { service.applyOp(1, 2, 'a'); }).toThrowError();
    });
  });

  describe('solveMathTest', function() {
    const testCases = [
      { input: '1', result: 1 },
      { input: '1+2', result: 3 },
      { input: '1-1', result: 0 },
      { input: '6*5', result: 30 },
      { input: '1+5*2', result: 11 },
      { input: '(1 +5)*2', result: 12 },
      { input: '1+5*2/ 2', result: 6 },
      { input: '(1+4) ^2+2', result: 27 }
    ];

    testCases.forEach(test => {
      it(`should solve ${test.input} to ${test.result}`, () => {
        expect(service.solveMath(test.input)).toBe(test.result);
      });
    });
  });

  describe('applyFunctionsTest', function() {
    const testCases = [
      { input: '=SUM(1,2)', result: '=3' },
      { input: '=SUM(1,2,6,2,71)', result: '=82' },
      { input: '=SUM(1,2)+SUM(3,2)', result: '=3+5' },
      { input: '=SUM(1,2)+SUM(1,2)', result: '=3+3' },
      { input: '=AVG(1,3)', result: '=2' },
      { input: '=SUM(1,2)+AVG(5,3)', result: '=3+4' },
      { input: '=SUM(3,AVG(5,3))', result: '=7' }
    ]

    testCases.forEach(test => {
      it(`should solve ${test.input} to ${test.result}`, () => {
        expect(service.applyFunctions(test.input)).toBe(test.result);
      });
    });

    it('should solve with whitespace', () => {
      expect(service.applyFunctions('= AVG( 1 , 3 )')).toBe('=4');
    });

    it('should throw error with no delimiters', () => {
      expect(() => { service.applyFunctions('=SUM(1,2)SUM(1,2)') }).toThrowError();
    });

    it('should throw error with unknown function', () => {
      expect(() => { service.applyFunctions('=BOB(1,2)') }).toThrowError();
    });
  });

  describe('getParameterValuesTest', function() {
    it(`should get single values`, () => {
      // arrange cells
      spyOn(sheetService, 'getCell').withArgs('1', 'A1').and.returnValue({
          address: 'A1',
          display: '1',
          formula: '=1'
        }
      );

      expect(service.getParameterValues('1', 'A1')).toEqual([1]);
    });

    it(`should get range values`, () => {
      // arrange cells
      spyOn(sheetService, 'getCell').withArgs('1', 'A1').and.returnValue({
        address: 'A1',
        display: '1',
        formula: 'q'
      }).withArgs('1', 'A2').and.returnValue({
        address: 'A2',
        display: '2',
        formula: 'q'
      }).withArgs('1', 'B1').and.returnValue({
        address: 'B1',
        display: '3',
        formula: 'q'
      }).withArgs('1', 'B2').and.returnValue({
        address: 'B2',
        display: '4',
        formula: 'q'
      }).withArgs('1', 'C1').and.returnValue({
        address: 'C1',
        display: '5',
        formula: 'q'
      }).withArgs('1', 'C2').and.returnValue({
        address: 'C2',
        display: '6',
        formula: '=1'
      });

      expect(service.getParameterValues('1', 'A1:C2')).toEqual([1, 2, 3, 4, 5, 6]);
      expect(service.getParameterValues('1', 'C2:A1')).toEqual([1, 2, 3, 4, 5, 6]);
    });
  });
});