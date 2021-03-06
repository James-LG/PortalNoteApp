import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CellInputComponent } from './cell-input.component';
import { FormsModule } from '@angular/forms';

describe('CellInputComponent', () => {
  let component: CellInputComponent;
  let fixture: ComponentFixture<CellInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule ],
      declarations: [ CellInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CellInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
