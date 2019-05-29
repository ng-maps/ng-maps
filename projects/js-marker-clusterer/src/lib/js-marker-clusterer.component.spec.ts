import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JsMarkerClustererComponent } from './js-marker-clusterer.component';

describe('JsMarkerClustererComponent', () => {
  let component: JsMarkerClustererComponent;
  let fixture: ComponentFixture<JsMarkerClustererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JsMarkerClustererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JsMarkerClustererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
