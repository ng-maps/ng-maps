import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnazzyInfoWindowComponent } from './snazzy-info-window.component';

describe('SnazzyInfoWindowComponent', () => {
  let component: SnazzyInfoWindowComponent;
  let fixture: ComponentFixture<SnazzyInfoWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnazzyInfoWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnazzyInfoWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
