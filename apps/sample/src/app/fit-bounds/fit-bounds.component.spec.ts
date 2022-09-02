import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FitBoundsComponent } from './fit-bounds.component';

describe('FitBoundsComponent', () => {
  let component: FitBoundsComponent;
  let fixture: ComponentFixture<FitBoundsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FitBoundsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FitBoundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
