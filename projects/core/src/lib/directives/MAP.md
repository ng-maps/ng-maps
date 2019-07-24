## Component

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'my-map',
  styles: [`
    map-view {
      height: 300px;
    }
 `],
  templateUrl: './my-map.component.html'
})
```

## Template

```angular2html
<map-view [latitude]="lat" [longitude]="lng" [zoom]="zoom"></map-view>
```
