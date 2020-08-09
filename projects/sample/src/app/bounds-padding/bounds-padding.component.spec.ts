import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoundsPaddingComponent } from './bounds-padding.component';

describe('BoundsPaddingComponent', () => {
  let component: BoundsPaddingComponent;
  let fixture: ComponentFixture<BoundsPaddingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BoundsPaddingComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoundsPaddingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
