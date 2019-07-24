## Component

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'my-map',
  styles: [`
    .agm-map-container {
      height: 300px;
    }
  `],
  templateUrl: './my-map.component.html'
})
```

## Template

```angular2html
<agm-map [latitude]="lat" [longitude]="lng" [zoom]="zoom">
  <agm-marker [latitude]="lat" [longitude]="lng" label="M"></agm-marker>
</agm-map>
```
