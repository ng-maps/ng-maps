import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-direction',
  templateUrl: './direction.component.html',
  styleUrls: ['./direction.component.css'],
})
export class DirectionComponent implements OnInit {
  public lat: number = 51.678418;
  public lng: number = 7.809007;

  public origin: any = {lat: 51.678418, lng: 7.809007};
  public destination: any = {lat: 51.708418, lng: 7.809007};

  public waypoints: Array<any> = [
    {
      location: {lat: 51.62418, lng: 7.809007},
      stopover: false
    },
    {
      location: {lat: 51.688418, lng: 7.809007},
      stopover: false
    },
    {
      location:{lat: 51.698418, lng: 7.809007},
      stopover: true
    }
  ];

  public markerOptions: any = {
    origin: {
      infoWindow: "Origin",
      icon: "https://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=home|FFFFFF|000000"
    },
    destination: {
      infoWindow: "Destination",
      icon: "https://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=home|FFFFFF|000000"
    },
    waypoints: [
      {
        infoWindow: "Waypoint 1",
        icon: "https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=1|FFFFFF|000000"
      },
      {
        infoWindow: "Waypoint 2",
        icon: "https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=2|FFFFFF|000000"
      },
      {
        infoWindow: "Waypoint 2",
        icon: "https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=3|FFFFFF|000000"
      }
    ]
  };

  public renderOptions: any = {
    suppressMarkers: true, //for custom-icons
    suppressPolylines: false
  };

  constructor() {}

  ngOnInit() {}
}
