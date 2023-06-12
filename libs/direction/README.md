# @ng-maps/direction

[@ng-maps/direction](https://github.com/@ng-maps/direction) is the directive for [@ng-maps/core](https://github.com/ng-maps/ng-maps)

- Angular
- Google Map API

![@ng-maps/direction](https://i.imgur.com/DCIoXqS.jpg)

## Credit

#### [SebastianM/angular-google-maps](https://github.com/SebastianM/angular-google-maps) - [Directions service #495](https://github.com/SebastianM/angular-google-maps/issues/495)

#### [explooosion/Agm-Direction](https://github.com/explooosion/Agm-Direction)

## Installation

Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```sh
npm install @ng-maps/direction
# or
yarn add @ng-maps/direction
```

## Importing Modules

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

import { NgMapsCoreModule } from '@ng-maps/core';
import { NgMapsGoogleModule } from '@ng-maps/google';
import { NgMapsDirectionModule } from '@ng-maps/direction';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    NgMapsCoreModule, //@ng-maps/core
    NgMapsGoogleModule, //@ng-maps/google
    NgMapsDirectionModule, //@ng-maps/direction
  ],
  providers: [
    {
      provide: GOOGLE_MAPS_API_CONFIG,
      useValue: {
        apiKey: 'YOUR_API_KEY',
      },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

## Usage

HTML

```html
<map-view [latitude]="lat" [longitude]="lng">
  <map-direction [origin]="origin" [destination]="destination"> </map-direction>
</map-view>
```

CSS

```css
map-view {
  height: 400px;
}
```

TS

```typescript
public lat = 24.799448;
public lng = 120.979021;

public origin: any;
public destination: any;

ngOnInit() {
  this.getDirection();
}

getDirection() {
  this.origin = { lat: 24.799448, lng: 120.979021 };
  this.destination = { lat: 24.799524, lng: 120.975017 };

  // Location within a string
  // this.origin = 'Taipei Main Station';
  // this.destination = 'Taiwan Presidential Office';
}
```

## Document

- Document [ng-maps-Docs](https://github.com/ng-maps/ng-maps#packages)

## License

[MIT](http://opensource.org/licenses/MIT)
