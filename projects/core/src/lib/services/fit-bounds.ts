import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, timer } from 'rxjs';
import { flatMap, map, sample, shareReplay, switchMap } from 'rxjs/operators';
import { BoundsLiteral } from '../interface/bounds';
import { GeoPoint } from '../interface/geo-point';
import { MapsAPILoader } from './maps-api-loader/maps-api-loader';

export interface FitBoundsDetails {
  latLng: GeoPoint;
}

/**
 * @internal
 */
export type BoundsMap = Map<string, GeoPoint>;

/**
 * Class to implement when you what to be able to make it work with the auto fit bounds feature
 * of AGM.
 */
export abstract class FitBoundsAccessor {
  abstract getFitBoundsDetails$(): Observable<FitBoundsDetails>;
}

/**
 * The FitBoundsService is responsible for computing the bounds of the a single map.
 */
@Injectable()
export abstract class FitBoundsService {
  protected readonly bounds$: Observable<BoundsLiteral>;
  protected readonly _boundsChangeSampleTime$ = new BehaviorSubject<number>(
    200,
  );
  protected readonly _includeInBounds$ = new BehaviorSubject<BoundsMap>(
    new Map<string, GeoPoint>(),
  );

  constructor(loader: MapsAPILoader) {
    this.bounds$ = from(loader.load()).pipe(
      flatMap(() => this._includeInBounds$),
      sample(
        this._boundsChangeSampleTime$.pipe(switchMap((time) => timer(0, time))),
      ),
      map((includeInBounds) => this.generateBounds(includeInBounds)),
      shareReplay(1),
    );
  }

  protected abstract generateBounds(
    includeInBounds: Map<string, GeoPoint>,
  ): BoundsLiteral;

  addToBounds(latLng: GeoPoint) {
    const id = this._createIdentifier(latLng);
    if (this._includeInBounds$.value.has(id)) {
      return;
    }
    const bounds = this._includeInBounds$.value;
    bounds.set(id, latLng);
    this._includeInBounds$.next(bounds);
  }

  removeFromBounds(latLng: google.maps.LatLng | google.maps.LatLngLiteral) {
    const bounds = this._includeInBounds$.value;
    bounds.delete(this._createIdentifier(latLng));
    this._includeInBounds$.next(bounds);
  }

  changeFitBoundsChangeSampleTime(timeMs: number) {
    this._boundsChangeSampleTime$.next(timeMs);
  }

  getBounds$(): Observable<BoundsLiteral> {
    return this.bounds$;
  }

  protected _createIdentifier(
    latLng: google.maps.LatLng | google.maps.LatLngLiteral,
  ): string {
    return `${latLng.lat}+${latLng.lng}`;
  }
}
