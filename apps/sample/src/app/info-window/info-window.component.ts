import { Component } from '@angular/core';

@Component({
    selector: 'app-info-window',
    templateUrl: './info-window.component.html',
    styleUrls: ['./info-window.component.css'],
    standalone: false
})
export class InfoWindowComponent {
  public lat: number = 51.678418;
  public lng: number = 7.809007;
}
