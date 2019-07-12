# @ng-maps/core

**@ng-maps/core** is a simple, modular and tree-shakable library for displaying google-maps inside an angular application

## Installation

- Npm: `npm install @ng-maps/core`
- Yarn: `yarn add @ng-maps/core`

Add `NgMapsCoreModule.forRoot({apiKey: 'YOUR_API_KEY'})` to your _AppModule_

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

| Name   | Type            | Values                                               | Description                                                                                                                            |
| ------ | --------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| layers | Array or String | `TrafficLayer` or `TransitLayer` or `BicyclingLayer` | Activates layer as described in [TrafficLayer Documentation](https://developers.google.com/maps/documentation/javascript/trafficlayer) |
| zoom   | Number          | Between 0 and MaxZoom, typically 18                  |

### Marker

Additionally you can add markers

```angular2html
<map-view [latitude]="48.858222" [longitude]="2.2945" [zoom]="8">
  <map-marker [latitude]="48.858222" [longitude]="2.2945"></map-marker>
</map-view>
```

## Additional features

Other features are provided in submodules. Find out more on the [project page at github](https://github.com/ng-maps/ng-maps)
