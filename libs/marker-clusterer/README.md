# @ng-maps/marker-clusterer

**@ng-maps/marker-clusterer** is a wrapper around [MarkerClusterer](https://github.com/googlemaps/js-markerclusterer)

## Installation

- Npm: `npm install @ng-maps/marker-clusterer`
- Yarn: `yarn add @ng-maps/marker-clusterer`

Add `NgMapsMarkerClustererModule` to your _AppModule_

## Usage

### MarkerClusterer

Add marker clusterer component around markers

```angular2html
<map-view [latitude]="48.858222" [longitude]="2.2945" [zoom]="8">
  <map-marker-cluster>
    <map-marker [latitude]="48.858222" [longitude]="2.2945"></map-marker>
  </map-marker-cluster>
</map-view>
```

### MarkerClustererOptions

The only options that can be passed to the marker clusterer are the renderer and algorithm. You might want to check their documentation: https://googlemaps.github.io/js-markerclusterer/

## Additional features

Other features are provided in submodules. Find out more on the [project page at github](https://github.com/ng-maps/ng-maps)
