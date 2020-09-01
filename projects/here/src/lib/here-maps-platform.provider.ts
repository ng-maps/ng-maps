import { Inject, Injectable } from '@angular/core';
import { MapsAPILoader } from '@ng-maps/core';
import { HereModuleOptions, HERE_MAPS_MODULE_OPTIONS } from './options';

@Injectable()
export class HereMapsPlatformProvider {
  private _platform: H.service.Platform;
  constructor(
    @Inject(HERE_MAPS_MODULE_OPTIONS)
    private options: HereModuleOptions | any,
    private loader: MapsAPILoader,
  ) {}

  public async getPlatform() {
    await this.loader.load();
    if (this._platform == null) {
      // Create a Platform object (one per application):
      this._platform = new H.service.Platform(
        (await this.options).platformOptions,
      );
      // Get an object containing the default map layers:
    }
    return this._platform;
  }
}
