import { Component, OnInit } from '@angular/core';

import { MARKERS } from './markers';

@Component({
  selector: 'app-shapes',
  templateUrl: './shapes.component.html',
  styleUrls: ['./shapes.component.css'],
})
export class ShapesComponent implements OnInit {
  public latA: number;
  public lngA: number;

  public latB: number;
  public lngB: number;

  public paths: Array<{ lat: number; lng: number }>;

  public north: number;
  public east: number;
  public west: number;
  public south: number;

  public ngOnInit() {
    const pointA = getRandomMarker();
    this.latA = parseFloat(pointA.latitude);
    this.lngA = parseFloat(pointA.longitude);
    const pointB = getRandomMarker();
    this.latB = parseFloat(pointB.latitude);
    this.lngB = parseFloat(pointB.longitude);

    this.paths = [
      getRandomMarker(),
      getRandomMarker(),
      getRandomMarker(),
      getRandomMarker(),
      getRandomMarker(),
    ].map((marker) => {
      return {
        lat: parseFloat(marker.latitude),
        lng: parseFloat(marker.longitude),
      };
    });

    this.north = parseFloat(getRandomMarker().latitude);
    this.east = parseFloat(getRandomMarker().longitude);
    this.west = parseFloat(getRandomMarker().longitude);
    this.south = parseFloat(getRandomMarker().latitude);
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
