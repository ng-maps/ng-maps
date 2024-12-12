import { Component } from '@angular/core';

@Component({
    selector: 'app-simple-map',
    templateUrl: './simple-map.component.html',
    styleUrls: ['./simple-map.component.css'],
    standalone: false
})
export class SimpleMapComponent {
  public lat: number = 51.678418;
  public lng: number = 7.809007;
}
