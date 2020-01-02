# @ng-maps/core

**@ng-maps/core** is a simple, modular and tree-shakable library for displaying google-maps inside an angular application

## Installation

- Npm: `npm install @ng-maps/core`
- Yarn: `yarn add @ng-maps/core`

Then you will need to install typings for google maps as a dev dependency

- Npm: `npm install -D @types/googlemaps`
- Yarn: `yarn add -D @types/googlemaps`

Now you are ready to start. Add `NgMapsCoreModule.forRoot({apiKey: 'YOUR_API_KEY'})` to your _AppModule_. Now you can use map components.

### Lazy loading configuration

If you can not provide configuration at module import level you can load it at a later time.

You just need to inject `MapsAPILoader` into a component or service and call the method `configure(config)` with a valid configuration.

## Usage

### Simple Map

Add the map to your components template

```angular2html
<map-view [latitude]="48.858222" [longitude]="2.2945" [zoom]="8"></map-view>
```

Add a height to your components CSS, for example

```CSS
map-view {
  height: 300px;
}
```

#### Input options

| Name      | Type                                                                                                                                                                                                                                                    | Values                                                                   | Description                                                                                                                            |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| longitude | Number                                                                                                                                                                                                                                                  |
| latitude  | Number                                                                                                                                                                                                                                                  |
| minZoom   | Number                                                                                                                                                                                                                                                  |
| maxZoom   | Number                                                                                                                                                                                                                                                  |
| zoom      | Number                                                                                                                                                                                                                                                  | Between 0 and MaxZoom, typically 18                                      |
| fitBounds | [LatLngBoundsLiteral](https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngBoundsLiteral), [LatLngBounds](https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngBounds) or Boolean | If set to `true` attaches to `mapFitBounds` directives on `<map-marker>` |
| mapTypeId | `roadmap`, `hybrid`, `satellite`, `terrain`                                                                                                                                                                                                             |
| layers    | Array or String                                                                                                                                                                                                                                         | `TrafficLayer` or `TransitLayer` or `BicyclingLayer`                     | Activates layer as described in [TrafficLayer Documentation](https://developers.google.com/maps/documentation/javascript/trafficlayer) |

### Marker

Additionally you can add markers

```angular2html
<map-view [latitude]="48.858222" [longitude]="2.2945" [zoom]="8">
  <map-marker [latitude]="48.858222" [longitude]="2.2945"></map-marker>
</map-view>
```

#### Input options

| Name      | Type   | Values | Description |
| --------- | ------ | ------ | ----------- |
| longitude | Number |
| latitude  | Number |

#### Outputs

| Name        | Value     | Description |
| ----------- | --------- | ----------- |
| markerClick | Component |

## Additional features

Other features are provided in submodules. Find out more on the [project page at github](https://github.com/ng-maps/ng-maps)
