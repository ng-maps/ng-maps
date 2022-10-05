import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css'],
})
export class AutocompleteComponent implements OnInit {
  address: google.maps.places.PlaceResult;
  lat: number | undefined;
  lng: number | undefined;

  constructor() {
    this.lat = 48.858222;
    this.lng = 2.2945;
  }

  ngOnInit() {}

  onPlacesResult(event: google.maps.places.PlaceResult): void {
    this.address = event;
    const coordinates = this.address.geometry;
    this.lat = coordinates?.location.lat();
    this.lng = coordinates?.location.lng();
  }
}
