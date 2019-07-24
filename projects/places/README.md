# @ng-maps/places

Components related

## Installation

- Npm: `npm install @ng-maps/places`
- Yarn: `yarn add @ng-maps/places`

Add `NgMapsPlacesModule` to the module you want to use this module in.

Add `places` to libraries of `NgMapsCoreModule.forRoot()`.

```ts
NgMapsCoreModule.forRoot({
  libraries: ['places'],
});
```

## Directives

### Autocomplete

Add `mapAutocomplete` to an input field like `<input mapAutocomplete />` or with options `<input [mapAutocomplete]="options" />`

- Options are from [AutocompleteOptions](https://developers.google.com/maps/documentation/javascript/reference/3.exp/places-widget#AutocompleteOptions)

Attach to result by adding listener for `placeResult` which returns a [PlaceResult](https://developers.google.com/maps/documentation/javascript/reference/3.exp/places-service#PlaceResult)
