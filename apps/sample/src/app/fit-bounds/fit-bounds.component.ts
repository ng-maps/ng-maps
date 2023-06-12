import { Component } from '@angular/core';

@Component({
  selector: 'app-fit-bounds',
  templateUrl: './fit-bounds.component.html',
  styleUrls: ['./fit-bounds.component.css'],
})
export class FitBoundsComponent {
  public boundaries = {
    east: 2.344366,
    north: 41.367178,
    south: 35.95133,
    west: -9.715647,
  };

  public points = [
    { lat: 41.146291, lon: -8.651419 },
    { lat: 41.142552, lon: -9.000486 },
    { lat: 39.069963, lon: -9.678067 },
    { lat: 38.891969, lon: -9.715647 },
    { lat: 38.805045, lon: -9.712396 },
    { lat: 38.662081, lon: -9.704042 },
    { lat: 37.146836, lon: -9.191508 },
    { lat: 36.864336, lon: -9.049121 },
    { lat: 36.842021, lon: -8.988834 },
    { lat: 35.968004, lon: -5.998535 },
    { lat: 35.95133, lon: -5.693665 },
    { lat: 36.006895, lon: -5.368195 },
    { lat: 36.531947, lon: -2.096442 },
    { lat: 36.610005, lon: -1.926779 },
    { lat: 37.453887, lon: -0.555435 },
    { lat: 37.484748, lon: -0.526268 },
    { lat: 38.558602, lon: 0.352948 },
    { lat: 41.191464, lon: 2.344366 },
    { lat: 41.367178, lon: 2.185217 },
  ];
}
