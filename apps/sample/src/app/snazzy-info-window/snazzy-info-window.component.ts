import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-snazzy-info-window',
  templateUrl: './snazzy-info-window.component.html',
  styleUrls: ['./snazzy-info-window.component.css'],
})
export class SnazzyInfoWindowComponent implements OnInit {
  lat: number = 51.678418;
  lng: number = 7.809007;
  constructor() {}

  ngOnInit() {}
}
