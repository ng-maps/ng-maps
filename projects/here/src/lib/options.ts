import { InjectionToken } from '@angular/core';

export const HERE_MAPS_MODULE_OPTIONS = new InjectionToken<HereModuleOptions>(
  'NgHereMaps ModuleOptions',
);

export enum HereMapsLibraries {
  CORE = 'core',
  SERVICE = 'service',
  MAPEVENTS = 'mapevents',
  UI = 'ui',
  CLUSTERING = 'clustering',
  DATA = 'data',
  PLACES = 'places',
  PANO = 'pano',
}

export interface HereModuleOptions {
  libraries?: Array<HereMapsLibraries>;
  version?: string;
  platformOptions: H.service.Platform.Options;
}
