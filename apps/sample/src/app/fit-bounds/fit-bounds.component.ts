import { Component } from '@angular/core';

@Component({
    selector: 'app-fit-bounds',
    templateUrl: './fit-bounds.component.html',
    styleUrls: ['./fit-bounds.component.css'],
    standalone: false
})
export class FitBoundsComponent {
  public boundaries = {
    east: 2.344366,
    north: 41.367178,
    south: 35.95133,
    west: -9.715647,
  };

  public points = [
    { lat: 41.146291, lng: -8.651419 },
    { lat: 41.142552, lng: -9.000486 },
    { lat: 39.069963, lng: -9.678067 },
    { lat: 38.891969, lng: -9.715647 },
    { lat: 38.805045, lng: -9.712396 },
    { lat: 38.662081, lng: -9.704042 },
    { lat: 37.146836, lng: -9.191508 },
    { lat: 36.864336, lng: -9.049121 },
    { lat: 36.842021, lng: -8.988834 },
    { lat: 35.968004, lng: -5.998535 },
    { lat: 35.95133, lng: -5.693665 },
    { lat: 36.006895, lng: -5.368195 },
    { lat: 36.531947, lng: -2.096442 },
    { lat: 36.610005, lng: -1.926779 },
    { lat: 37.453887, lng: -0.555435 },
    { lat: 37.484748, lng: -0.526268 },
    { lat: 38.558602, lng: 0.352948 },
    { lat: 41.191464, lng: 2.344366 },
    { lat: 41.367178, lng: 2.185217 },
  ];
}
