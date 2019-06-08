import { NgZone } from '@angular/core';
import { async, inject, TestBed } from '@angular/core/testing';

import { NgMapsMarkerComponent } from '../../directives/marker';
import { GoogleMapsAPIWrapper } from '../google-maps-api-wrapper';
import { MarkerManager } from './marker-manager';

describe('MarkerManager', () => {
  let apiWrapperMock: jasmine.SpyObj<GoogleMapsAPIWrapper>;
  beforeEach(() => {
    apiWrapperMock = jasmine.createSpyObj('GoogleMapsAPIWrapper', ['createMarker']);
    TestBed.configureTestingModule({
      providers: [
        {provide: NgZone, useFactory: () => new NgZone({enableLongStackTrace: true})},
        MarkerManager,
        {
          provide: GoogleMapsAPIWrapper,
          useValue: apiWrapperMock
        }
      ]
    });
  });

  describe('Create a new marker', () => {
    it('should call the mapsApiWrapper when creating a new marker',
      async(inject(
        [MarkerManager, GoogleMapsAPIWrapper],
        (markerManager: MarkerManager, apiWrapper: GoogleMapsAPIWrapper) => {
          const newMarker = new NgMapsMarkerComponent(markerManager);
          newMarker.latitude = 34.4;
          newMarker.longitude = 22.3;
          newMarker.label = 'A';
          markerManager.addMarker(newMarker).then(() => {
            expect(apiWrapper.createMarker).toHaveBeenCalledWith({
              position: {lat: 34.4, lng: 22.3},
              label: 'A',
              draggable: false,
              icon: undefined,
              opacity: 1,
              visible: true,
              zIndex: 1,
              title: undefined,
              clickable: true,
              animation: undefined
            });
          });
        }))
    );
  });

  describe('Delete a marker', () => {
    it('should set the map to null when deleting a existing marker',
      async(inject(
        [MarkerManager, GoogleMapsAPIWrapper],
        (markerManager: MarkerManager, apiWrapper: GoogleMapsAPIWrapper) => {
          const newMarker = new NgMapsMarkerComponent(markerManager);
          newMarker.latitude = 34.4;
          newMarker.longitude = 22.3;
          newMarker.label = 'A';

          const markerInstance: Partial<google.maps.Marker> = jasmine.createSpyObj('markerInstance', ['setMap']);

          (apiWrapper as jasmine.SpyObj<GoogleMapsAPIWrapper>).createMarker.and.returnValue(Promise.resolve(markerInstance as any));

          markerManager.addMarker(newMarker).then(() => {
            markerManager.deleteMarker(newMarker);
            expect(markerInstance.setMap).toHaveBeenCalledWith(null);
          });
        }))
    );
  });

  describe('set marker icon', () => {
    it('should update that marker via setIcon method when the markerUrl changes',
      async(inject(
        [MarkerManager, GoogleMapsAPIWrapper],
        (markerManager: MarkerManager, apiWrapper: GoogleMapsAPIWrapper) => {
          const newMarker = new NgMapsMarkerComponent(markerManager);
          newMarker.latitude = 34.4;
          newMarker.longitude = 22.3;
          newMarker.label = 'A';

          const markerInstance: Partial<google.maps.Marker> = jasmine.createSpyObj('markerInstance', ['setMap', 'setIcon']);

          (apiWrapper as jasmine.SpyObj<GoogleMapsAPIWrapper>).createMarker.and.returnValue(Promise.resolve(markerInstance as any));

          markerManager.addMarker(newMarker).then(() => {
            expect(apiWrapper.createMarker).toHaveBeenCalledWith({
              position: {lat: 34.4, lng: 22.3},
              label: 'A',
              draggable: false,
              icon: undefined,
              opacity: 1,
              visible: true,
              zIndex: 1,
              title: undefined,
              clickable: true,
              animation: undefined
            });
            const iconUrl = 'http://angular-maps.com/icon.png';
            newMarker.iconUrl = iconUrl;
            markerManager.updateIcon(newMarker);
            expect(markerInstance.setIcon).toHaveBeenCalledWith(iconUrl);
          });

        }))
    );
  });

  describe('set marker opacity', () => {
    it('should update that marker via setOpacity method when the markerOpacity changes',
      async(inject(
        [MarkerManager, GoogleMapsAPIWrapper],
        (markerManager: MarkerManager, apiWrapper: GoogleMapsAPIWrapper) => {
          const newMarker = new NgMapsMarkerComponent(markerManager);
          newMarker.latitude = 34.4;
          newMarker.longitude = 22.3;
          newMarker.label = 'A';

          const markerInstance: Partial<google.maps.Marker> = jasmine.createSpyObj('markerInstance', ['setMap', 'setOpacity']);

          (apiWrapper as jasmine.SpyObj<GoogleMapsAPIWrapper>).createMarker.and.returnValue(Promise.resolve(markerInstance as any));

          markerManager.addMarker(newMarker).then(() => {
            expect(apiWrapper.createMarker).toHaveBeenCalledWith({
              position: {lat: 34.4, lng: 22.3},
              label: 'A',
              draggable: false,
              icon: undefined,
              visible: true,
              opacity: 1,
              zIndex: 1,
              title: undefined,
              clickable: true,
              animation: undefined
            });
            const opacity = 0.4;
            newMarker.opacity = opacity;
            markerManager.updateOpacity(newMarker);
            expect(markerInstance.setOpacity).toHaveBeenCalledWith(opacity);
          });
        }))
    );
  });

  describe('set visible option', () => {
    it('should update that marker via setVisible method when the visible changes',
      async(inject(
        [MarkerManager, GoogleMapsAPIWrapper],
        (markerManager: MarkerManager, apiWrapper: GoogleMapsAPIWrapper) => {
          const newMarker = new NgMapsMarkerComponent(markerManager);
          newMarker.latitude = 34.4;
          newMarker.longitude = 22.3;
          newMarker.label = 'A';
          newMarker.visible = false;

          const markerInstance: Partial<google.maps.Marker> = jasmine.createSpyObj('markerInstance', ['setMap', 'setVisible']);

          (apiWrapper as jasmine.SpyObj<GoogleMapsAPIWrapper>).createMarker.and.returnValue(Promise.resolve(markerInstance as any));

          markerManager.addMarker(newMarker).then(() => {
            expect(apiWrapper.createMarker).toHaveBeenCalledWith({
              position: {lat: 34.4, lng: 22.3},
              label: 'A',
              draggable: false,
              icon: undefined,
              visible: false,
              opacity: 1,
              zIndex: 1,
              title: undefined,
              clickable: true,
              animation: undefined
            });
            newMarker.visible = true;
            markerManager.updateVisible(newMarker);
            expect(markerInstance.setVisible).toHaveBeenCalledWith(true);
          });
        }))
    );
  });

  describe('set zIndex option', () => {
    it('should update that marker via setZIndex method when the zIndex changes',
      async(inject(
        [MarkerManager, GoogleMapsAPIWrapper],
        (markerManager: MarkerManager, apiWrapper: GoogleMapsAPIWrapper) => {
          const newMarker = new NgMapsMarkerComponent(markerManager);
          newMarker.latitude = 34.4;
          newMarker.longitude = 22.3;
          newMarker.label = 'A';
          newMarker.visible = false;

          const markerInstance: Partial<google.maps.Marker> = jasmine.createSpyObj('markerInstance', ['setMap', 'setZIndex']);

          (apiWrapper as jasmine.SpyObj<GoogleMapsAPIWrapper>).createMarker.and.returnValue(Promise.resolve(markerInstance as any));

          markerManager.addMarker(newMarker).then(() => {
            expect(apiWrapper.createMarker).toHaveBeenCalledWith({
              position: {lat: 34.4, lng: 22.3},
              label: 'A',
              draggable: false,
              icon: undefined,
              visible: false,
              opacity: 1,
              zIndex: 1,
              title: undefined,
              clickable: true,
              animation: undefined
            });
            const zIndex = 10;
            newMarker.zIndex = zIndex;
            markerManager.updateZIndex(newMarker);
            expect(markerInstance.setZIndex).toHaveBeenCalledWith(zIndex);
          });
        }))
    );
  });
});
