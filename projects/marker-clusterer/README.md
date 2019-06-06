# @ng-maps/marker-clusterer

**@ng-maps/marker-clusterer** is a wrapper around [MarkerClusterer](https://github.com/googlemaps/v3-utility-library/tree/master/markerclusterer)

## Installation

* Npm: `npm install @ng-maps/marker-clusterer`
* Yarn: `yarn add @ng-maps/marker-clusterer`

Add `NgMapsMarkerClustererModule.forRoot({imagePath: '/assets/images/m'})` to your _AppModule_

You need to download images for clusters from https://github.com/googlemaps/v3-utility-library/tree/master/markerclusterer/images or provide your own. The path you placed the images to can be specified globally through configuration like mentioned above or by setting `imagePath` attribute on the component.

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

## Additional features

Other features are provided in submodules. Find out more on the [project page at github](https://github.com/ng-maps/ng-maps ) 
