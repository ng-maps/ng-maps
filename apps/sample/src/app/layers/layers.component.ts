import { Component } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

@Component({
  selector: 'app-layers',
  templateUrl: './layers.component.html',
  styleUrls: ['./layers.component.css'],
  standalone: false,
})
export class LayersComponent {
  public lat: number = 51.678418;
  public lng: number = 7.809007;

  public layerForm = this.fb.group({
    TrafficLayer: [false],
    TransitLayer: [false],
    BicyclingLayer: [false],
  });

  public layers = [];
  public _layers = new Set();

  constructor(private fb: UntypedFormBuilder) {
    this.layerForm.valueChanges.subscribe({
      next: (values) => {
        Object.entries(values).forEach((entry) => {
          const layer = entry[0];
          if (entry[1]) {
            this._layers.add(layer);
          } else {
            this._layers.delete(layer);
          }
          this.layers = Array.from(this._layers);
        });
      },
    });
  }
}
