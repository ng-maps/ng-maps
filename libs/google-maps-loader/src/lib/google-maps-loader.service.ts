import { Inject, Injectable, Optional } from '@angular/core';
import { ScriptService } from 'ngx-script-loader';
import { ReplaySubject } from 'rxjs';
import { LAZY_MAPS_API_CONFIG, MapsAPILoader } from '@ng-maps/core';
import { GoogleMapsLoaderConfig } from './google-maps-loader.config';

@Injectable()
export class GoogleMapsLoaderService implements MapsAPILoader {
  protected _document: Document;
  protected _window: Window;
  protected _configuration: ReplaySubject<GoogleMapsLoaderConfig> = new ReplaySubject(
    1,
  );

  constructor(
    @Optional()
    @Inject(LAZY_MAPS_API_CONFIG)
    private config: GoogleMapsLoaderConfig,
    private scriptLoader: ScriptService,
  ) {}

  public configure(config: GoogleMapsLoaderConfig) {
    this._configuration.next(config);
  }

  public load(): Promise<void> {
    return undefined;
  }
}
