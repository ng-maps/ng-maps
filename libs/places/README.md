# @ng-maps/places

Components related to places library. Currently only an autocomplete directive is implemented that can be attached to an input field to provide places suggestions

## Installation

- Npm: `npm install @ng-maps/places`
- Yarn: `yarn add @ng-maps/places`

Add `NgMapsPlacesModule` to the module you want to use this module in.

You will also need to load the places library together with google maps. To achieve this you have to add it to the `GOOGLE_MAPS_API_CONFIG` provider.

```ts
{
  provide: GOOGLE_MAPS_API_CONFIG,
  useValue: {
    …
    libraries: ['places']
  }
}
```

### Configuration

There are different possibilities to add a default configuration to the module.

You can use either `NgMapsPlacesModule.forRoot(<ConfigOptions>)` or `NgMapsPlacesModule.forRootFactory(() => <ConfigOptions>, [...depts])`.

Or you can provide a configuration with the `NG_MAPS_PLACES_DEFAULT_CONFIGURATION` injection token.

## Directives

### Autocomplete

Add `mapAutocomplete` to an input field like `<input mapAutocomplete />` or with options `<input [mapAutocomplete]="options" />`

- Options are from [AutocompleteOptions](https://developers.google.com/maps/documentation/javascript/reference/3.exp/places-widget#AutocompleteOptions)

Attach to result by adding listener for `placeResult` which returns a [PlaceResult](https://developers.google.com/maps/documentation/javascript/reference/3.exp/places-service#PlaceResult)
