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
  zoom: number = 10;
}
```

## Template

```angular2html
<map-view [latitude]="lat" [longitude]="lng" [zoom]="zoom">
  <map-marker [latitude]="lat" [longitude]="lng" label="M"></map-marker>
</map-view>
```
