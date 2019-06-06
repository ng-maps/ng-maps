import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgMapsSnazzyInfoWindowComponent } from './snazzy-info-window.component';

describe('SnazzyInfoWindowComponent', () => {
  let component: NgMapsSnazzyInfoWindowComponent;
  let fixture: ComponentFixture<NgMapsSnazzyInfoWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgMapsSnazzyInfoWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgMapsSnazzyInfoWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
