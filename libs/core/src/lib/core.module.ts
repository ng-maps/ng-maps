import { InjectionToken, NgModule } from '@angular/core';

import { NgMapsCircleDirective } from './directives/circle';
import { NgMapsFitBoundsDirective } from './directives/fit-bounds';
import { NgMapsInfoWindowComponent } from './directives/info-window';
import { NgMapsViewComponent } from './directives/map';
import { NgMapsMarkerComponent } from './directives/marker';
import { NgMapsPolygonDirective } from './directives/polygon';
import { NgMapsPolyline } from './directives/polyline';
import { NgMapsPolylinePoint } from './directives/polyline-point';
import { NgMapsRectangleDirective } from './directives/rectangle';

export const MAP_PROVIDER = new InjectionToken<string>('Map Provider');

export function isGoogleMaps(token: string) {
  return token === 'GoogleMaps';
}

export function isHereMaps(token: string) {
  return token === 'HereMaps';
}

/**
 * @internal
 */
export function coreDirectives() {
  return [
    NgMapsViewComponent,
    NgMapsMarkerComponent,
    NgMapsInfoWindowComponent,
    NgMapsFitBoundsDirective,
    NgMapsCircleDirective,
    NgMapsPolygonDirective,
    NgMapsPolyline,
    NgMapsPolylinePoint,
    NgMapsRectangleDirective,
  ];
}

/**
 * The ng-maps core module. Contains all Directives/Services/Pipes
 */
@NgModule({
  declarations: coreDirectives(),
  exports: coreDirectives(),
})
export class NgMapsCoreModule {}
