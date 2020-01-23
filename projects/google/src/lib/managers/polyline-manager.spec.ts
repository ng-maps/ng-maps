import { NgZone } from '@angular/core';
import { fakeAsync, inject, TestBed } from '@angular/core/testing';
import { GoogleMapsAPIWrapper } from '@ng-maps/core';

import { NgMapsPolyline } from '../directives/polyline';
import { GooglePolylineManager } from './polyline-manager';

describe('PolylineManager', () => {
  let apiWrapperMock: jasmine.SpyObj<GoogleMapsAPIWrapper>;
  beforeEach(() => {
    apiWrapperMock = jasmine.createSpyObj('GoogleMapsAPIWrapper', [
      'createPolyline',
    ]);
    TestBed.configureTestingModule({
      providers: [
        {
          provide: NgZone,
          useFactory: () => new NgZone({ enableLongStackTrace: true }),
        },
        GooglePolylineManager,
        {
          provide: GoogleMapsAPIWrapper,
          useValue: apiWrapperMock,
        },
      ],
    });
  });

  describe('Create a new polyline', () => {
    it('should call the mapsApiWrapper when creating a new polyline', inject(
      [GooglePolylineManager, GoogleMapsAPIWrapper],
      (
        polylineManager: GooglePolylineManager,
        apiWrapper: GoogleMapsAPIWrapper,
      ) => {
        const newPolyline = new NgMapsPolyline(polylineManager);
        polylineManager.addPolyline(newPolyline);

        expect(apiWrapper.createPolyline).toHaveBeenCalledWith({
          clickable: true,
          draggable: false,
          editable: false,
          geodesic: false,
          strokeColor: undefined,
          strokeOpacity: undefined,
          strokeWeight: undefined,
          visible: true,
          zIndex: undefined,
          icons: undefined,
          path: [],
        });
      },
    ));
  });

  describe('Delete a polyline', () => {
    let polylineInstance: Partial<google.maps.Polyline>;
    beforeEach(() => {
      polylineInstance = jasmine.createSpyObj('polylineInstance', ['setMap']);
    });

    it('should set the map to null when deleting a existing polyline', fakeAsync(
      inject(
        [GooglePolylineManager, GoogleMapsAPIWrapper],
        (
          polylineManager: GooglePolylineManager,
          apiWrapper: GoogleMapsAPIWrapper,
        ) => {
          const newPolyline = new NgMapsPolyline(polylineManager);

          (apiWrapper as jasmine.SpyObj<
            GoogleMapsAPIWrapper
          >).createPolyline.and.returnValue(
            Promise.resolve(polylineInstance as any),
          );

          polylineManager.addPolyline(newPolyline);
          polylineManager.deletePolyline(newPolyline).then(() => {
            expect(polylineInstance.setMap).toHaveBeenCalledWith(null);
          });
        },
      ),
    ));
  });
});
