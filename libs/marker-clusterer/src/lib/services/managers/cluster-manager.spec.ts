import { NgZone } from '@angular/core';
import { waitForAsync, inject, TestBed } from '@angular/core/testing';

import { MapsApiWrapper, NgMapsMarkerComponent } from '@ng-maps/core';

import { ClusterManager } from './cluster-manager';

describe('ClusterManager', () => {
  let apiWrapperMock: jasmine.SpyObj<MapsApiWrapper>;
  beforeEach(() => {
    apiWrapperMock = jasmine.createSpyObj('MapsApiWrapper', ['createMarker']);

    TestBed.configureTestingModule({
      providers: [
        {
          provide: NgZone,
          useFactory: () => new NgZone({ enableLongStackTrace: true }),
        },
        ClusterManager,
        {
          provide: MapsApiWrapper,
          useValue: apiWrapperMock,
        },
      ],
    });
  });

  describe('Create a new marker', () => {
    it('should call the mapsApiWrapper when creating a new marker', waitForAsync(
      inject(
        [ClusterManager, MapsApiWrapper],
        (clusterManager: ClusterManager, apiWrapper: MapsApiWrapper) => {
          const newMarker = new NgMapsMarkerComponent(clusterManager);
          newMarker.latitude = 34.4;
          newMarker.longitude = 22.3;
          newMarker.label = 'A';
          clusterManager.addMarker(newMarker).then(() => {
            expect(apiWrapper.createMarker).toHaveBeenCalledWith(
              { lat: 34.4, lng: 22.3 },
              {
                label: 'A',
                // draggable: false,
                // icon: undefined,
                // opacity: 1,
                visible: true,
                zIndex: 1,
                title: undefined,
                clickable: true,
              },
              false,
            );
          });
        },
      ),
    ));
  });

  describe('Delete a marker', () => {
    it('should set the map to null when deleting a existing marker', waitForAsync(
      inject(
        [ClusterManager, MapsApiWrapper],
        (clusterManager: ClusterManager, apiWrapper: MapsApiWrapper) => {
          const newMarker = new NgMapsMarkerComponent(clusterManager);
          newMarker.latitude = 34.4;
          newMarker.longitude = 22.3;
          newMarker.label = 'A';

          const markerInstance: Partial<google.maps.Marker> =
            jasmine.createSpyObj('polygonInstance', ['setMap']);

          (
            apiWrapper as jasmine.SpyObj<MapsApiWrapper>
          ).createMarker.and.returnValue(
            Promise.resolve(markerInstance as any),
          );

          clusterManager.addMarker(newMarker).then(() => {
            clusterManager.deleteMarker(newMarker).then(() => {
              expect(markerInstance.setMap).toHaveBeenCalledWith(null);
            });
          });
        },
      ),
    ));
  });

  describe('set marker icon', () => {
    it('should update that marker via setIcon method when the markerUrl changes', waitForAsync(
      inject(
        [ClusterManager, MapsApiWrapper],
        (markerManager: ClusterManager, apiWrapper: MapsApiWrapper) => {
          const newMarker = new NgMapsMarkerComponent(markerManager);
          newMarker.latitude = 34.4;
          newMarker.longitude = 22.3;
          newMarker.label = 'A';

          const markerInstance: Partial<google.maps.Marker> =
            jasmine.createSpyObj('polygonInstance', ['setMap', 'setIcon']);

          (
            apiWrapper as jasmine.SpyObj<MapsApiWrapper>
          ).createMarker.and.returnValue(
            Promise.resolve(markerInstance as any),
          );

          markerManager.addMarker(newMarker).then(() => {
            expect(apiWrapper.createMarker).toHaveBeenCalledWith(
              { lat: 34.4, lng: 22.3 },
              {
                label: 'A',
                // draggable: false,
                // icon: undefined,
                // opacity: 1,
                visible: true,
                zIndex: 1,
                title: undefined,
                clickable: true,
              },
              false,
            );
            const iconUrl = 'http://angular-maps.com/icon.png';
            newMarker.iconUrl = iconUrl;
            markerManager.updateIcon(newMarker);
            expect(markerInstance.setIcon).toHaveBeenCalledWith(iconUrl);
          });
        },
      ),
    ));
  });

  describe('set marker opacity', () => {
    it('should update that marker via setOpacity method when the markerOpacity changes', waitForAsync(
      inject(
        [ClusterManager, MapsApiWrapper],
        (markerManager: ClusterManager, apiWrapper: MapsApiWrapper) => {
          const newMarker = new NgMapsMarkerComponent(markerManager);
          newMarker.latitude = 34.4;
          newMarker.longitude = 22.3;
          newMarker.label = 'A';

          const markerInstance: Partial<google.maps.Marker> =
            jasmine.createSpyObj('polygonInstance', ['setMap', 'setOpacity']);

          (
            apiWrapper as jasmine.SpyObj<MapsApiWrapper>
          ).createMarker.and.returnValue(
            Promise.resolve(markerInstance as any),
          );

          markerManager.addMarker(newMarker).then(() => {
            expect(apiWrapper.createMarker).toHaveBeenCalledWith(
              { lat: 34.4, lng: 22.3 },
              {
                label: 'A',
                // draggable: false,
                // icon: undefined,
                visible: true,
                // opacity: 1,
                zIndex: 1,
                title: undefined,
                clickable: true,
              },
              false,
            );
            const opacity = 0.4;
            newMarker.opacity = opacity;
            markerManager.updateOpacity(newMarker);
            expect(markerInstance.setOpacity).toHaveBeenCalledWith(opacity);
          });
        },
      ),
    ));
  });

  describe('set visible option', () => {
    it('should update that marker via setVisible method when the visible changes', waitForAsync(
      inject(
        [ClusterManager, MapsApiWrapper],
        (markerManager: ClusterManager, apiWrapper: MapsApiWrapper) => {
          const newMarker = new NgMapsMarkerComponent(markerManager);
          newMarker.latitude = 34.4;
          newMarker.longitude = 22.3;
          newMarker.label = 'A';
          newMarker.visible = false;

          const markerInstance: Partial<google.maps.Marker> =
            jasmine.createSpyObj('markerInstance', ['setMap', 'setVisible']);

          (
            apiWrapper as jasmine.SpyObj<MapsApiWrapper>
          ).createMarker.and.returnValue(
            Promise.resolve(markerInstance as any),
          );

          markerManager.addMarker(newMarker).then(() => {
            expect(apiWrapper.createMarker).toHaveBeenCalledWith(
              { lat: 34.4, lng: 22.3 },
              {
                label: 'A',
                // draggable: false,
                // icon: undefined,
                visible: false,
                // opacity: 1,
                zIndex: 1,
                title: undefined,
                clickable: true,
              },
              false,
            );
            newMarker.visible = true;
            markerManager.updateVisible(newMarker);
            expect(markerInstance.setVisible).toHaveBeenCalledWith(true);
          });
        },
      ),
    ));
  });

  describe('set zIndex option', () => {
    it('should update that marker via setZIndex method when the zIndex changes', waitForAsync(
      inject(
        [ClusterManager, MapsApiWrapper],
        (markerManager: ClusterManager, apiWrapper: MapsApiWrapper) => {
          const newMarker = new NgMapsMarkerComponent(markerManager);
          newMarker.latitude = 34.4;
          newMarker.longitude = 22.3;
          newMarker.label = 'A';
          newMarker.visible = false;

          const markerInstance: Partial<google.maps.Marker> =
            jasmine.createSpyObj('markerInstance', ['setMap', 'setZIndex']);

          (
            apiWrapper as jasmine.SpyObj<MapsApiWrapper>
          ).createMarker.and.returnValue(
            Promise.resolve(markerInstance as any),
          );

          markerManager.addMarker(newMarker).then(() => {
            expect(apiWrapper.createMarker).toHaveBeenCalledWith(
              { lat: 34.4, lng: 22.3 },
              {
                label: 'A',
                // draggable: false,
                // icon: undefined,
                visible: false,
                // opacity: 1,
                zIndex: 1,
                title: undefined,
                clickable: true,
              },
              false,
            );
            const zIndex = 10;
            newMarker.zIndex = zIndex;
            markerManager.updateZIndex(newMarker);
            expect(markerInstance.setZIndex).toHaveBeenCalledWith(zIndex);
          });
        },
      ),
    ));
  });
});
