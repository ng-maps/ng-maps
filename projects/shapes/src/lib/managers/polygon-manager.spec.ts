import {NgZone} from '@angular/core';
import {TestBed, inject} from '@angular/core/testing';

import {NgMapsPolygon} from '../directives/polygon';
import {GoogleMapsAPIWrapper} from '../../../../core/src/lib/services/google-maps-api-wrapper';
import {Polygon} from '../google-maps-types';
import {PolygonManager} from './polygon-manager';

describe('PolygonManager', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: NgZone, useFactory: () => new NgZone({enableLongStackTrace: true})},
        PolygonManager, NgMapsPolygon, {
          provide: GoogleMapsAPIWrapper,
          useValue: {
            createPolygon: jest.fn()
          }
        }
      ]
    });
  });

  describe('Create a new polygon', () => {
    it('should call the mapsApiWrapper when creating a new polygon',
       inject(
           [PolygonManager, GoogleMapsAPIWrapper],
           (polygonManager: PolygonManager, apiWrapper: GoogleMapsAPIWrapper) => {
             const newPolygon = new NgMapsPolygon(polygonManager);
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
               zIndex: undefined
             });
           }));
  });

  describe('Delete a polygon', () => {
    it('should set the map to null when deleting a existing polygon',
       inject(
           [PolygonManager, GoogleMapsAPIWrapper],
           (polygonManager: PolygonManager, apiWrapper: GoogleMapsAPIWrapper) => {
             const newPolygon = new NgMapsPolygon(polygonManager);

             const polygonInstance: any = {
              setMap: jest.fn()
             };
             (<jest.Mock>apiWrapper.createPolygon).mockReturnValue(Promise.resolve(polygonInstance));

             polygonManager.addPolygon(newPolygon);
             polygonManager.deletePolygon(newPolygon).then(() => {
               expect(polygonInstance.setMap).toHaveBeenCalledWith(null);
             });
           }));
  });
});
