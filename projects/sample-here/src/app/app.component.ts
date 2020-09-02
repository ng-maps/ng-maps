import { Component, OnInit } from '@angular/core';
import { BoundsLiteral, GeoPoint, NgMapsMarkerComponent } from '@ng-maps/core';
import { MARKERS } from '../../../sample/src/app/shapes/markers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  latA: number;
  lngA: number;
  latB: number;
  lngB: number;
  ngOnInit(): void {
    const pointA = getRandomMarker();
    this.latA = parseFloat(pointA.latitude);
    this.lngA = parseFloat(pointA.longitude);
    const pointB = getRandomMarker();
    this.latB = parseFloat(pointB.latitude);
    this.lngB = parseFloat(pointB.longitude);
  }
  title = 'sample-here';
  boundaries = {
    east: 2.344366,
    north: 41.367178,
    south: 35.95133,
    west: -9.715647,
  };

  onCenterChange($event: GeoPoint) {
    console.log('Center Changed', $event);
  }

  onZoomChange($event: number) {
    console.log('Zoom Changed', $event);
  }

  onBoundsChange($event: BoundsLiteral) {
    console.log('Bounds Changed', $event);
  }

  markerClick($event: NgMapsMarkerComponent) {
    console.log($event);
  }

  mouseOut($event: google.maps.MouseEvent) {
    console.log('mouseOut', $event);
  }
}

function getRandomMarker() {
  return MARKERS[getRandomInt(0, MARKERS.length - 1)];
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
