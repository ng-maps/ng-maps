import { NgZone } from '@angular/core';
import { fakeAsync, inject, TestBed } from '@angular/core/testing';

import { MapsApiWrapper, NgMapsPolygonDirective } from '@ng-maps/core';

import { GooglePolygonManager } from './polygon.manager';

describe('PolygonManager', () => {
  let apiWrapperMock: jasmine.SpyObj<MapsApiWrapper>;
  beforeEach(() => {
    apiWrapperMock = jasmine.createSpyObj('GoogleMapsAPIWrapper', [
      'createPolygon',
    ]);
    TestBed.configureTestingModule({
      providers: [
        {
          provide: NgZone,
          useFactory: () => new NgZone({ enableLongStackTrace: true }),
        },
        GooglePolygonManager,
        NgMapsPolygonDirective,
        {
          provide: MapsApiWrapper,
          useValue: apiWrapperMock,
        },
      ],
    });
  });

  describe('Create a new polygon', () => {
    it('should call the mapsApiWrapper when creating a new polygon', inject(
      [GooglePolygonManager, MapsApiWrapper],
      (polygonManager: GooglePolygonManager, apiWrapper: MapsApiWrapper) => {
        const newPolygon = new NgMapsPolygonDirective(polygonManager);
        polygonManager.addPolygon(newPolygon);

        expect(apiWrapper.createPolygon).toHaveBeenCalledWith({
          clickable: true,
          draggable: false,
          editable: false,
          fillColor: undefined,
          fillOpacity: undefined,
          geodesic: false,
          paths: [],
          strokeColor: undefined,
          strokeOpacity: undefined,
          strokeWeight: undefined,
          visible: undefined,
          zIndex: undefined,
        });
      },
    ));
  });

  describe('Delete a polygon', () => {
    it('should set the map to null when deleting a existing polygon', fakeAsync(
      inject(
        [GooglePolygonManager, MapsApiWrapper],
        (polygonManager: GooglePolygonManager, apiWrapper: MapsApiWrapper) => {
          const newPolygon = new NgMapsPolygonDirective(polygonManager);

          const polygonInstance: Partial<google.maps.Rectangle> =
            jasmine.createSpyObj('polygonInstance', ['setMap']);

          (
            apiWrapper as jasmine.SpyObj<MapsApiWrapper>
          ).createPolygon.and.returnValue(
            Promise.resolve(polygonInstance as any),
          );

          polygonManager.addPolygon(newPolygon);
          polygonManager.deletePolygon(newPolygon).then(() => {
            expect(polygonInstance.setMap).toHaveBeenCalledWith(null);
          });
        },
      ),
    ));
  });
});
