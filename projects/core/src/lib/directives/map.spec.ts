import { ElementRef, Injectable } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { mockProvider } from '@ngneat/spectator';
import { EMPTY } from 'rxjs';
import { FitBoundsService } from '../services/fit-bounds';
import { GoogleMapsAPIWrapper } from '../services/google-maps-api-wrapper';
import { NgMapsViewComponent } from './map';
import SpyObj = jasmine.SpyObj;

@Injectable()
class MockElementRef {
  nativeElement = {};
}

describe('NgMapsViewComponent', () => {
  let fixture: ComponentFixture<NgMapsViewComponent>;
  let component: NgMapsViewComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NgMapsViewComponent],
    })
      .overrideComponent(NgMapsViewComponent, {
        set: {
          providers: [
            { provide: ElementRef, useClass: MockElementRef },
            mockProvider(GoogleMapsAPIWrapper, {
              subscribeToMapEvent: () => EMPTY,
            }),
            mockProvider(FitBoundsService),
          ],
        },
      })
      .compileComponents();
    fixture = TestBed.createComponent(NgMapsViewComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create a component', () => {
    expect(component).toBeTruthy();
  });

  it('should not enable controls when disableViewControls is true', () => {
    component.disableDefaultUI = true;
    fixture.detectChanges();
    const mockApiWrapper = fixture.debugElement.injector.get(
      GoogleMapsAPIWrapper,
    ) as SpyObj<GoogleMapsAPIWrapper>;
    expect(
      mockApiWrapper.createMap.calls.first().args[1].streetViewControl,
    ).not.toBe(true);
    expect(mockApiWrapper.createMap.calls.first().args[1].zoomControl).not.toBe(
      true,
    );
  });
});
