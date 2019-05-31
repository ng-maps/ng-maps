import { NgModule } from '@angular/core';
import { NgMapsCircle } from './directives/circle';
import { NgMapsPolygon } from './directives/polygon';
import { NgMapsPolyline } from './directives/polyline';
import { NgMapsPolylinePoint } from './directives/polyline-point';
import { NgMapsRectangle } from './directives/rectangle';

/**
 * @internal
 */
export function shapesDirectives() {
  return [
    NgMapsCircle,
    NgMapsPolygon,
    NgMapsPolyline,
    NgMapsPolylinePoint,
    NgMapsRectangle
  ];
}

@NgModule({
  declarations: shapesDirectives(),
  exports: shapesDirectives()
})
export class NgMapsShapesModule {
}
