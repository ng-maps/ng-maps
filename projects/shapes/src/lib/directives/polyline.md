# Polyline

## Example

### Component

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'my-map',
  styles: [
    `
      .agm-map-container {
        height: 300px;
      }
    `,
  ],
  templateUrl: './my-map.component.html',
})
export class MyMapComponent {}
```

### Template

```angular2html
<agm-map [latitude]="lat" [longitude]="lng" [zoom]="zoom">
  <agm-polyline>
    <agm-polyline-point [latitude]="latA" [longitude]="lngA">
    </agm-polyline-point>
    <agm-polyline-point [latitude]="latB" [longitude]="lngB">
    </agm-polyline-point>
  </agm-polyline>
</agm-map>
```
