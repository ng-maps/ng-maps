# @ng-maps/google

**@ng-maps/google** is a simple, modular and tree-shakable library for displaying google-maps inside an angular application

## Installation

- Npm: `npm install @ng-maps/google`
- Yarn: `yarn add @ng-maps/google`

Then you will need to install typings for google maps as a dev dependency

- Npm: `npm install -D @types/google.maps`
- Yarn: `yarn add -D @types/google.maps`

Add `NgMapsGoogleModule` to your _AppModule_.

Provide your API key with the token provider

```ts
{
  provide: GOOGLE_MAPS_API_CONFIG,
  useValue: {
    apiKey: 'YOUR_API_KEY'
  }
}
```
