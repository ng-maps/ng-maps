import { ElementRef, Injectable, SimpleChange } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { mockProvider } from '@ngneat/spectator';
import { EMPTY } from 'rxjs';

import { FitBoundsService } from '../services/fit-bounds';
import { MapsApiWrapper as GoogleMapsAPIWrapper } from '../services/maps-api-wrapper';

import { NgMapsViewComponent } from './map';

@Injectable()
class MockElementRef {
  public nativeElement = {};
}

xdescribe('NgMapsViewComponent', () => {
  let fixture: ComponentFixture<NgMapsViewComponent<any>>;
  let component: NgMapsViewComponent<any>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NgMapsViewComponent],
    })
      .overrideComponent(NgMapsViewComponent, {
        set: {
          providers: [
            { provide: ElementRef, useClass: MockElementRef },
            mockProvider(GoogleMapsAPIWrapper, {
              subscribeToMapEvent: () => EMPTY,
              fitBounds: jasmine.createSpy('fitBounds', () =>
                Promise.resolve({}),
              ),
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
    ) as jasmine.SpyObj<GoogleMapsAPIWrapper>;
    expect(
      // @ts-expect-error
      mockApiWrapper.createMap.calls.first().args[1].streetViewControl,
    ).not.toBe(true);
    // @ts-expect-error
    expect(mockApiWrapper.createMap.calls.first().args[1].zoomControl).not.toBe(
      true,
    );
  });

  it('should not fit bounds if provided bounds are empty', () => {
    component.fitBounds = false;
    component.ngOnChanges({
      latitude: new SimpleChange(null, 1, false),
      longitude: new SimpleChange(null, 2, false),
      fitBounds: new SimpleChange({}, null, false),
    });

    const mockApiWrapper = fixture.debugElement.injector.get(
      GoogleMapsAPIWrapper,
    ) as jasmine.SpyObj<GoogleMapsAPIWrapper>;
    expect(mockApiWrapper.fitBounds).toHaveBeenCalledTimes(0);
  });
});
