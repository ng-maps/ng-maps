import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HereComponent } from './here.component';

xdescribe('HereComponent', () => {
  let component: HereComponent;
  let fixture: ComponentFixture<HereComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HereComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
