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
export class MyComponent {
  lat: number = 51.678418;
  lng: number = 7.809007;
  lat2: number = 51.66;
  lng2: number = 7.80911;
  zoom: number = 10;
}
```

## Template

```angular2html
<map-view [latitude]="lat" [longitude]="lng" [zoom]="zoom">
  <map-marker-cluster>
    <map-marker [latitude]="lat" [longitude]="lng" label="M">
    </map-marker>
    <map-marker [latitude]="lat2" [longitude]="lng2" label="N">
    </map-marker>
  </map-marker-cluster>
</map-view>
```
