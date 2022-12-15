import { SimpleChange, SimpleChanges } from '@angular/core';

import { NgMapsPolylinePoint } from './polyline-point';

describe('PolylinePoint', () => {
  describe('ngOnChanges', () => {
    it('should emit positionChanged on latitude change', () => {
      const polylinePoint = new NgMapsPolylinePoint();
      polylinePoint.latitude = 50;
      polylinePoint.longitude = -50;
      spyOn(polylinePoint.positionChanged, 'emit');

      const positionChanges: SimpleChanges = {
        latitude: new SimpleChange('previousLat', 'newLat', false),
      };

      polylinePoint.ngOnChanges(positionChanges);

      expect(polylinePoint.positionChanged.emit).toHaveBeenCalledWith({
        // @ts-expect-error
        lat: 'newLat',
        lng: -50,
      });
    });
    it('should emit positionChanged on longitude change', () => {
      const polylinePoint = new NgMapsPolylinePoint();
      polylinePoint.latitude = 50;
      polylinePoint.longitude = -50;
      spyOn(polylinePoint.positionChanged, 'emit');

      const positionChanges: SimpleChanges = {
        longitude: new SimpleChange('previousLng', 'newLng', false),
      };

      polylinePoint.ngOnChanges(positionChanges);

      expect(polylinePoint.positionChanged.emit).toHaveBeenCalledWith({
        lat: 50,
        // @ts-expect-error
        lng: 'newLng',
      });
    });
    it('should emit positionChanged on latitude and longitude change', () => {
      const polylinePoint = new NgMapsPolylinePoint();
      polylinePoint.latitude = 50;
      polylinePoint.longitude = -50;
      spyOn(polylinePoint.positionChanged, 'emit');

      const positionChanges: SimpleChanges = {
        latitude: new SimpleChange('previousLat', 'newLat', false),
        longitude: new SimpleChange('previousLng', 'newLng', false),
      };

      polylinePoint.ngOnChanges(positionChanges);

      expect(polylinePoint.positionChanged.emit).toHaveBeenCalledWith({
        // @ts-expect-error
        lat: 'newLat',
        // @ts-expect-error
        lng: 'newLng',
      });
    });
  });
});
