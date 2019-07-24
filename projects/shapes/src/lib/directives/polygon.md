## Component

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'my-map',
  styles: [
    `
      map-view {
        height: 300px;
      }
    `,
  ],
  templateUrl: './my-map.component.html',
})
export class MyMapComponent {
  lat: number = 0;
  lng: number = 0;
  zoom: number = 10;
  paths: Array<LatLngLiteral> = [
    { lat: 0, lng: 10 },
    { lat: 0, lng: 20 },
    { lat: 10, lng: 20 },
    { lat: 10, lng: 10 },
    { lat: 0, lng: 10 },
  ];
  // Nesting paths will create a hole where they overlap;
  nestedPaths: Array<Array<LatLngLiteral>> = [
    [
      { lat: 0, lng: 10 },
      { lat: 0, lng: 20 },
      { lat: 10, lng: 20 },
      { lat: 10, lng: 10 },
      { lat: 0, lng: 10 },
    ],
    [
      { lat: 0, lng: 15 },
      { lat: 0, lng: 20 },
      { lat: 5, lng: 20 },
      { lat: 5, lng: 15 },
      { lat: 0, lng: 15 },
    ],
  ];
}
```

## Template

```angular2html
<agm-map [latitude]="lat" [longitude]="lng" [zoom]="zoom">
  <agm-polygon [paths]="paths"></agm-polygon>
</agm-map>
```
