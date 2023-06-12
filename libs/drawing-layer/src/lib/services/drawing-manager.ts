import { Injectable, NgZone } from '@angular/core';
// eslint-disable-next-line import/named
import { Observable, Observer } from 'rxjs';

import { MapsApiWrapper, NgMapsViewComponent } from '@ng-maps/core';

import { NgMapsDrawingLayer } from '../directives/drawing-layer';

@Injectable({
  providedIn: NgMapsViewComponent,
})
export class DrawingManager {
  // eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle,id-blacklist,id-match
  protected _drawingManagers: Map<
    NgMapsDrawingLayer,
    Promise<google.maps.drawing.DrawingManager>
  > = new Map();

  // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
  constructor(
    protected _mapsWrapper: MapsApiWrapper,
    protected _zone: NgZone,
  ) {}

  addDrawingManager(drawingManager: NgMapsDrawingLayer) {
    const drawingManagerPromise = this._mapsWrapper.createDrawingManager({
      drawingMode: drawingManager.drawingMode,
      drawingControl: drawingManager.drawingControl,
      drawingControlOptions: drawingManager.drawingControlOptions,
      circleOptions: drawingManager.circleOptions,
      markerOptions: drawingManager.markerOptions,
      polylineOptions: drawingManager.polylineOptions,
      polygonOptions: drawingManager.polygonOptions,
      rectangleOptions: drawingManager.rectangleOptions,
    });
    this._drawingManagers.set(drawingManager, drawingManagerPromise);
  }

  async deleteDrawingManager(
    drawingManager: NgMapsDrawingLayer,
  ): Promise<void> {
    const dm = await this._drawingManagers.get(drawingManager);
    if (dm) {
      this._zone.run(() => {
        dm.setMap(null);
        this._drawingManagers.delete(drawingManager);
      });
    }
  }

  async updateDrawingMode(drawingManager: NgMapsDrawingLayer): Promise<void> {
    const dm = await this._drawingManagers.get(drawingManager);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    dm.setOptions({ drawingMode: drawingManager.drawingMode });
  }

  updateDrawingControl(drawingManager: NgMapsDrawingLayer): Promise<void> {
    return this._drawingManagers
      .get(drawingManager)
      .then((dm: google.maps.drawing.DrawingManager) =>
        dm.setOptions({ drawingControl: drawingManager.drawingControl }),
      );
  }

  updateDrawingControlOptions(
    drawingManager: NgMapsDrawingLayer,
  ): Promise<void> {
    return this._drawingManagers
      .get(drawingManager)
      .then((dm: google.maps.drawing.DrawingManager) =>
        dm.setOptions({
          drawingControlOptions: drawingManager.drawingControlOptions,
        }),
      );
  }

  updateCircleOptions(drawingManager: NgMapsDrawingLayer): Promise<void> {
    return this._drawingManagers
      .get(drawingManager)
      .then((dm: google.maps.drawing.DrawingManager) =>
        dm.setOptions({ circleOptions: drawingManager.circleOptions }),
      );
  }

  updateMarkerOptions(drawingManager: NgMapsDrawingLayer): Promise<void> {
    return this._drawingManagers
      .get(drawingManager)
      .then((dm: google.maps.drawing.DrawingManager) =>
        dm.setOptions({ markerOptions: drawingManager.markerOptions }),
      );
  }

  updatePolylineOptions(drawingManager: NgMapsDrawingLayer): Promise<void> {
    return this._drawingManagers
      .get(drawingManager)
      .then((dm: google.maps.drawing.DrawingManager) =>
        dm.setOptions({ polylineOptions: drawingManager.polylineOptions }),
      );
  }

  updatePolygonOptions(drawingManager: NgMapsDrawingLayer): Promise<void> {
    return this._drawingManagers
      .get(drawingManager)
      .then((dm: google.maps.drawing.DrawingManager) =>
        dm.setOptions({ polygonOptions: drawingManager.polygonOptions }),
      );
  }

  updateRectangleOptions(drawingManager: NgMapsDrawingLayer): Promise<void> {
    return this._drawingManagers
      .get(drawingManager)
      .then((dm: google.maps.drawing.DrawingManager) =>
        dm.setOptions({ rectangleOptions: drawingManager.rectangleOptions }),
      );
  }

  createEventObservable<T>(
    eventName: string,
    drawingManager: NgMapsDrawingLayer,
  ): Observable<T> {
    return new Observable((observer: Observer<T>) => {
      this._drawingManagers
        .get(drawingManager)
        .then((dm: google.maps.drawing.DrawingManager) => {
          dm.addListener(eventName, (e: T) =>
            this._zone.run(() => observer.next(e)),
          );
        });
    });
  }
}
