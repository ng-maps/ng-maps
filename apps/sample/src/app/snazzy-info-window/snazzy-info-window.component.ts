import { Component } from '@angular/core';

@Component({
    selector: 'app-snazzy-info-window',
    templateUrl: './snazzy-info-window.component.html',
    styleUrls: ['./snazzy-info-window.component.css'],
    standalone: false
})
export class SnazzyInfoWindowComponent {
  public lat: number = 51.678418;
  public lng: number = 7.809007;
}
