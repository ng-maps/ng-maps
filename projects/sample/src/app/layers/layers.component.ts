import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-layers',
  templateUrl: './layers.component.html',
  styleUrls: ['./layers.component.css'],
})
export class LayersComponent implements OnInit {
  lat: number = 51.678418;
  lng: number = 7.809007;

  layerForm = this.fb.group({
    TrafficLayer: [false],
    TransitLayer: [false],
    BicyclingLayer: [false],
  });

  layers = [];
  _layers = new Set();

  constructor(private fb: FormBuilder) {
    this.layerForm.valueChanges.subscribe({
      next: (values) => {
        console.log('changes', values);
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

  ngOnInit() {}
}
