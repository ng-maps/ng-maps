import { NgZone } from '@angular/core';
import { waitForAsync, inject, TestBed } from '@angular/core/testing';

import { MapsApiWrapper } from '@ng-maps/core';

import { NgMapsDrawingLayer } from '../directives/drawing-layer';

import { DrawingManager } from './drawing-manager';

describe('DrawingManager', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: NgZone,
          useFactory: () => new NgZone({ enableLongStackTrace: true }),
        },
        DrawingManager,
        {
          provide: MapsApiWrapper,
          useValue: jasmine.createSpyObj('GoogleMapsAPIWrapper', [
            'createDrawingManager',
          ]),
        },
      ],
    });
  });

  describe('Create a new drawing manager', () => {
    it('should call the mapsApiWrapper when creating a new drawing manager', inject(
      [DrawingManager, MapsApiWrapper],
      (drawingManagerManager: DrawingManager, apiWrapper: MapsApiWrapper) => {
        const newDrawingManager = new NgMapsDrawingLayer(drawingManagerManager);
        // @ts-ignore
        newDrawingManager.drawingMode = 'circle';
        newDrawingManager.drawingControl = false;

        drawingManagerManager.addDrawingManager(newDrawingManager);

        expect(apiWrapper.createDrawingManager).toHaveBeenCalledWith({
          drawingMode: 'circle',
          drawingControl: false,
          drawingControlOptions: undefined,
          circleOptions: undefined,
          markerOptions: undefined,
          polylineOptions: undefined,
          polygonOptions: undefined,
          rectangleOptions: undefined,
        });
      },
    ));
  });

  describe('Delete a drawing manager', () => {
    it('should set the map to null when deleting a existing drawing manager', inject(
      [DrawingManager, MapsApiWrapper],
      (drawingManagerManager: DrawingManager, apiWrapper: MapsApiWrapper) => {
        const newDrawingManager = new NgMapsDrawingLayer(drawingManagerManager);

        const drawingManagerInstance: DrawingManager = jasmine.createSpyObj(
          'DrawingManager',
          ['setMap'],
        );
        (apiWrapper.createDrawingManager as any).and.returnValue(
          Promise.resolve(drawingManagerInstance),
        );

        drawingManagerManager.addDrawingManager(newDrawingManager);
        drawingManagerManager
          .deleteDrawingManager(newDrawingManager)
          .then(() => {
            // @ts-ignore
            expect(drawingManagerInstance.setMap).toHaveBeenCalledWith(null);
          });
      },
    ));
  });

  describe('set drawing manager drawing mode', () => {
    it('should update drawing manager via setDrawingMode method when the drawingMode changes', waitForAsync(
      inject(
        [DrawingManager, MapsApiWrapper],
        (drawingManagerManager: DrawingManager, apiWrapper: MapsApiWrapper) => {
          const newDrawingManager = new NgMapsDrawingLayer(
            drawingManagerManager,
          );

          const drawingManagerInstance: DrawingManager = jasmine.createSpyObj(
            'DrawingManager',
            ['setMap', 'setOptions'],
          );
          (apiWrapper.createDrawingManager as any).and.returnValue(
            Promise.resolve(drawingManagerInstance),
          );

          drawingManagerManager.addDrawingManager(newDrawingManager);
          expect(apiWrapper.createDrawingManager).toHaveBeenCalledWith({
            drawingMode: undefined,
            drawingControl: undefined,
            drawingControlOptions: undefined,
            circleOptions: undefined,
            markerOptions: undefined,
            polylineOptions: undefined,
            polygonOptions: undefined,
            rectangleOptions: undefined,
          });

          const drawingMode = 'POLYGON';
          // @ts-ignore
          newDrawingManager.drawingMode = drawingMode;
          return drawingManagerManager
            .updateDrawingMode(newDrawingManager)
            .then(() => {
              // @ts-ignore
              expect(drawingManagerInstance.setOptions).toHaveBeenCalledWith({
                drawingMode,
              });
            });
        },
      ),
    ));
  });

  describe('set drawing manager drawing control', () => {
    it('should update drawing manager via setDrawingControl method when the drawingControl changes', waitForAsync(
      inject(
        [DrawingManager, MapsApiWrapper],
        (drawingManagerManager: DrawingManager, apiWrapper: MapsApiWrapper) => {
          const newDrawingManager = new NgMapsDrawingLayer(
            drawingManagerManager,
          );

          const drawingManagerInstance: DrawingManager = jasmine.createSpyObj(
            'DrawingManager',
            ['setMap', 'setOptions'],
          );
          (apiWrapper.createDrawingManager as any).and.returnValue(
            Promise.resolve(drawingManagerInstance),
          );

          drawingManagerManager.addDrawingManager(newDrawingManager);
          expect(apiWrapper.createDrawingManager).toHaveBeenCalledWith({
            drawingMode: undefined,
            drawingControl: undefined,
            drawingControlOptions: undefined,
            circleOptions: undefined,
            markerOptions: undefined,
            polylineOptions: undefined,
            polygonOptions: undefined,
            rectangleOptions: undefined,
          });

          const drawingControl = false;
          newDrawingManager.drawingControl = drawingControl;
          return drawingManagerManager
            .updateDrawingControl(newDrawingManager)
            .then(() => {
              // @ts-ignore
              expect(drawingManagerInstance.setOptions).toHaveBeenCalledWith({
                drawingControl,
              });
            });
        },
      ),
    ));
  });

  describe('set drawing manager drawing control options', () => {
    it('should update drawing manager via setDrawingControlOptions method when the drawingControlOptions changes', waitForAsync(
      inject(
        [DrawingManager, MapsApiWrapper],
        (drawingManagerManager: DrawingManager, apiWrapper: MapsApiWrapper) => {
          const newDrawingManager = new NgMapsDrawingLayer(
            drawingManagerManager,
          );

          const drawingManagerInstance: DrawingManager = jasmine.createSpyObj(
            'DrawingManager',
            ['setMap', 'setOptions'],
          );
          (apiWrapper.createDrawingManager as any).and.returnValue(
            Promise.resolve(drawingManagerInstance),
          );

          drawingManagerManager.addDrawingManager(newDrawingManager);
          expect(apiWrapper.createDrawingManager).toHaveBeenCalledWith({
            drawingMode: undefined,
            drawingControl: undefined,
            drawingControlOptions: undefined,
            circleOptions: undefined,
            markerOptions: undefined,
            polylineOptions: undefined,
            polygonOptions: undefined,
            rectangleOptions: undefined,
          });

          const drawingControlOptions = {
            position: 10,
            drawingMode: ['circle'],
          };
          newDrawingManager.drawingControlOptions = drawingControlOptions;
          return drawingManagerManager
            .updateDrawingControlOptions(newDrawingManager)
            .then(() => {
              // @ts-ignore
              expect(drawingManagerInstance.setOptions).toHaveBeenCalledWith({
                drawingControlOptions,
              });
            });
        },
      ),
    ));
  });

  describe('set drawing manager circle options', () => {
    it('should update drawing manager via setCircleOptions method when the circleOptions changes', waitForAsync(
      inject(
        [DrawingManager, MapsApiWrapper],
        (drawingManagerManager, apiWrapper) => {
          const newDrawingManager = new NgMapsDrawingLayer(
            drawingManagerManager,
          );

          const drawingManagerInstance: DrawingManager = jasmine.createSpyObj(
            'DrawingManager',
            ['setMap', 'setOptions'],
          );
          (apiWrapper.createDrawingManager as any).and.returnValue(
            Promise.resolve(drawingManagerInstance),
          );

          drawingManagerManager.addDrawingManager(newDrawingManager);
          expect(apiWrapper.createDrawingManager).toHaveBeenCalledWith({
            drawingMode: undefined,
            drawingControl: undefined,
            drawingControlOptions: undefined,
            circleOptions: undefined,
            markerOptions: undefined,
            polylineOptions: undefined,
            polygonOptions: undefined,
            rectangleOptions: undefined,
          });

          const circleOptions = { clickable: false };
          newDrawingManager.circleOptions = circleOptions;
          return drawingManagerManager
            .updateCircleOptions(newDrawingManager)
            .then(() => {
              // @ts-ignore
              expect(drawingManagerInstance.setOptions).toHaveBeenCalledWith({
                circleOptions,
              });
            });
        },
      ),
    ));
  });

  describe('set drawing manager marker options', () => {
    it('should update drawing manager via setCircleOptions method when the markerOptions changes', waitForAsync(
      inject(
        [DrawingManager, MapsApiWrapper],
        (drawingManagerManager: DrawingManager, apiWrapper: MapsApiWrapper) => {
          const newDrawingManager = new NgMapsDrawingLayer(
            drawingManagerManager,
          );

          const drawingManagerInstance: DrawingManager = jasmine.createSpyObj(
            'DrawingManager',
            ['setMap', 'setOptions'],
          );
          (apiWrapper.createDrawingManager as any).and.returnValue(
            Promise.resolve(drawingManagerInstance),
          );

          drawingManagerManager.addDrawingManager(newDrawingManager);
          expect(apiWrapper.createDrawingManager).toHaveBeenCalledWith({
            drawingMode: undefined,
            drawingControl: undefined,
            drawingControlOptions: undefined,
            circleOptions: undefined,
            markerOptions: undefined,
            polylineOptions: undefined,
            polygonOptions: undefined,
            rectangleOptions: undefined,
          });

          const markerOptions = {
            clickable: false,
            position: { lat: 0.1, lng: 0.1 } as google.maps.LatLngLiteral,
          };
          newDrawingManager.markerOptions = markerOptions;
          return drawingManagerManager
            .updateMarkerOptions(newDrawingManager)
            .then(() => {
              // @ts-ignore
              expect(drawingManagerInstance.setOptions).toHaveBeenCalledWith({
                markerOptions,
              });
            });
        },
      ),
    ));
  });

  describe('set drawing manager polyline options', () => {
    it('should update drawing manager via setPolylineOptions method when the polylineOptions changes', waitForAsync(
      inject(
        [DrawingManager, MapsApiWrapper],
        (drawingManagerManager: DrawingManager, apiWrapper: MapsApiWrapper) => {
          const newDrawingManager = new NgMapsDrawingLayer(
            drawingManagerManager,
          );

          const drawingManagerInstance: DrawingManager = jasmine.createSpyObj(
            'DrawingManager',
            ['setMap', 'setOptions'],
          );
          (apiWrapper.createDrawingManager as any).and.returnValue(
            Promise.resolve(drawingManagerInstance),
          );

          drawingManagerManager.addDrawingManager(newDrawingManager);
          expect(apiWrapper.createDrawingManager).toHaveBeenCalledWith({
            drawingMode: undefined,
            drawingControl: undefined,
            drawingControlOptions: undefined,
            circleOptions: undefined,
            markerOptions: undefined,
            polylineOptions: undefined,
            polygonOptions: undefined,
            rectangleOptions: undefined,
          });

          const polylineOptions = { clickable: false };
          newDrawingManager.polylineOptions = polylineOptions;
          return drawingManagerManager
            .updatePolylineOptions(newDrawingManager)
            .then(() => {
              // @ts-ignore
              expect(drawingManagerInstance.setOptions).toHaveBeenCalledWith({
                polylineOptions,
              });
            });
        },
      ),
    ));
  });

  describe('set drawing manager polygon options', () => {
    it('should update drawing manager via setPolygonOptions method when the polygonOptions changes', waitForAsync(
      inject(
        [DrawingManager, MapsApiWrapper],
        (drawingManagerManager: DrawingManager, apiWrapper: MapsApiWrapper) => {
          const newDrawingManager = new NgMapsDrawingLayer(
            drawingManagerManager,
          );

          const drawingManagerInstance: DrawingManager = jasmine.createSpyObj(
            'DrawingManager',
            ['setMap', 'setOptions'],
          );
          (apiWrapper.createDrawingManager as any).and.returnValue(
            Promise.resolve(drawingManagerInstance),
          );

          drawingManagerManager.addDrawingManager(newDrawingManager);
          expect(apiWrapper.createDrawingManager).toHaveBeenCalledWith({
            drawingMode: undefined,
            drawingControl: undefined,
            drawingControlOptions: undefined,
            circleOptions: undefined,
            markerOptions: undefined,
            polylineOptions: undefined,
            polygonOptions: undefined,
            rectangleOptions: undefined,
          });

          const polygonOptions = { clickable: false };
          newDrawingManager.polygonOptions = polygonOptions;
          return drawingManagerManager
            .updatePolygonOptions(newDrawingManager)
            .then(() => {
              // @ts-ignore
              expect(drawingManagerInstance.setOptions).toHaveBeenCalledWith({
                polygonOptions,
              });
            });
        },
      ),
    ));
  });

  describe('set drawing manager rectangle options', () => {
    it('should update drawing manager via setRectangleOptions method when the rectangleOptions changes', waitForAsync(
      inject(
        [DrawingManager, MapsApiWrapper],
        (drawingManagerManager: DrawingManager, apiWrapper: MapsApiWrapper) => {
          const newDrawingManager = new NgMapsDrawingLayer(
            drawingManagerManager,
          );

          const drawingManagerInstance: DrawingManager = jasmine.createSpyObj(
            'DrawingManager',
            ['setMap', 'setOptions'],
          );
          (apiWrapper.createDrawingManager as any).and.returnValue(
            Promise.resolve(drawingManagerInstance),
          );

          drawingManagerManager.addDrawingManager(newDrawingManager);
          expect(apiWrapper.createDrawingManager).toHaveBeenCalledWith({
            drawingMode: undefined,
            drawingControl: undefined,
            drawingControlOptions: undefined,
            circleOptions: undefined,
            markerOptions: undefined,
            polylineOptions: undefined,
            polygonOptions: undefined,
            rectangleOptions: undefined,
          });

          const rectangleOptions = { clickable: false };
          newDrawingManager.rectangleOptions = rectangleOptions;
          return drawingManagerManager
            .updateRectangleOptions(newDrawingManager)
            .then(() => {
              // @ts-ignore
              expect(drawingManagerInstance.setOptions).toHaveBeenCalledWith({
                rectangleOptions,
              });
            });
        },
      ),
    ));
  });
});
