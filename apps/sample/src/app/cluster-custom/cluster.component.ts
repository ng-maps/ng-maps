import { Component } from '@angular/core';
import { Renderer } from '@googlemaps/markerclusterer';

@Component({
    templateUrl: './cluster.component.html',
    styleUrls: ['./cluster.component.css'],
    standalone: false
})
export class CustomClusterComponent {
  public mockLocations = [
    { lat: -31.56391, lng: 147.154312 },
    { lat: -33.718234, lng: 150.363181 },
    { lat: -33.727111, lng: 150.371124 },
    { lat: -33.848588, lng: 151.209834 },
    { lat: -33.851702, lng: 151.216968 },
    { lat: -34.671264, lng: 150.863657 },
    { lat: -35.304724, lng: 148.662905 },
    { lat: -36.817685, lng: 175.699196 },
    { lat: -36.828611, lng: 175.790222 },
    { lat: -37.75, lng: 145.116667 },
    { lat: -37.759859, lng: 145.128708 },
    { lat: -37.765015, lng: 145.133858 },
    { lat: -37.770104, lng: 145.143299 },
    { lat: -37.7737, lng: 145.145187 },
    { lat: -37.774785, lng: 145.137978 },
    { lat: -37.819616, lng: 144.968119 },
    { lat: -38.330766, lng: 144.695692 },
    { lat: -39.927193, lng: 175.053218 },
    { lat: -41.330162, lng: 174.865694 },
    { lat: -42.734358, lng: 147.439506 },
    { lat: -42.734358, lng: 147.501315 },
    { lat: -42.735258, lng: 147.438 },
    { lat: -43.999792, lng: 170.463352 },
  ];

  public clusterRenderer: Renderer = {
    render: ({ count, position }) => {
      return new google.maps.Marker({
        position,
        icon: {
          url: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGhlaWdodD0iNTEycHgiIGlkPSJMYXllcl8xIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgd2lkdGg9IjUxMnB4IiB4bWw6c3BhY2U9InByZXNlcnZlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48Zz48Zz48cGF0aCBkPSJNMjU2LDQ4QzE0MS4xLDQ4LDQ4LDE0MS4xLDQ4LDI1NnM5My4xLDIwOCwyMDgsMjA4YzExNC45LDAsMjA4LTkzLjEsMjA4LTIwOFMzNzAuOSw0OCwyNTYsNDh6IE0yNTYsNDQ2LjcgICAgYy0xMDUuMSwwLTE5MC43LTg1LjUtMTkwLjctMTkwLjdjMC0xMDUuMSw4NS41LTE5MC43LDE5MC43LTE5MC43YzEwNS4xLDAsMTkwLjcsODUuNSwxOTAuNywxOTAuNyAgICBDNDQ2LjcsMzYxLjEsMzYxLjEsNDQ2LjcsMjU2LDQ0Ni43eiIvPjwvZz48L2c+PGc+PGc+PHBhdGggZD0iTTI1Niw5NmMtODguNCwwLTE2MCw3MS42LTE2MCwxNjBjMCw4OC40LDcxLjYsMTYwLDE2MCwxNjBjODguNCwwLDE2MC03MS42LDE2MC0xNjBDNDE2LDE2Ny42LDM0NC40LDk2LDI1Niw5NnoiLz48L2c+PC9nPjwvc3ZnPg==',
          scaledSize: new google.maps.Size(50, 50),
        },
        label: {
          text: String(count),
          color: 'rgba(255,255,255,1)',
          fontSize: '18px',
          fontWeight: 'bold',
        },
        // adjust zIndex to be above other markers
        zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
      });
    },
  };
}
