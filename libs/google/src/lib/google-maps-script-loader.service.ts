import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Optional } from '@angular/core';
import { ReplaySubject } from 'rxjs';

import { MapsAPILoader } from '@ng-maps/core';

import {
  GoogleMapsScriptProtocol,
  GoogleModuleOptions,
  GOOGLE_MAPS_API_CONFIG,
} from './options';

@Injectable()
export class GoogleMapsScriptLoader extends MapsAPILoader {
  protected _scriptLoadingPromise: Promise<void>;
  protected _config: ReplaySubject<GoogleModuleOptions> = new ReplaySubject<GoogleModuleOptions>(
    1,
  );
  protected _document: Document;
  protected _window: Window;
  protected readonly _SCRIPT_ID: string = 'GoogleMapsApiScript';
  protected readonly callbackName: string = `LazyMapsAPILoader`;

  constructor(
    @Optional()
    @Inject(GOOGLE_MAPS_API_CONFIG)
    config: GoogleModuleOptions,
    @Inject(DOCUMENT) document: any,
  ) {
    super();
    if (config instanceof Promise) {
      config.then((c) => {
        this.configure(c);
      });
    } else if (typeof config === 'object') {
      this.configure(config);
    }
    this._document = document as Document;
    this._window = this._document.defaultView;
  }

  /**
   * If no configuration is provided at load time you can use this function to provide configuration at any time.
   * Loading scripts will be postponed until a configuration is provided
   *
   * @param config - {@link GoogleModuleOptions} configuration needed for bootstrapping
   */
  public configure(config: GoogleModuleOptions) {
    this._config.next(config);
    this._config.complete();
  }

  public load(): Promise<void> {
    if ((this._window as any).google && (this._window as any).google.maps) {
      // Google maps already loaded on the page
      return Promise.resolve();
    } else if (this._scriptLoadingPromise) {
      return this._scriptLoadingPromise;
    } else {
      this._scriptLoadingPromise = this.checkScriptElement();
      return this._scriptLoadingPromise;
    }
  }

  protected async checkScriptElement(): Promise<void> {
    let scriptElement: HTMLScriptElement = this._document.getElementById(
      this._SCRIPT_ID,
    ) as HTMLScriptElement;
    if (scriptElement == null) {
      scriptElement = await this.createScriptElement();
    }
    return this.assignScriptLoadingPromise(scriptElement);
  }

  protected assignScriptLoadingPromise(
    scriptElement: HTMLScriptElement,
  ): Promise<void> {
    this._document.body.appendChild(scriptElement);
    return new Promise((resolve, reject) => {
      this._window[this.callbackName] = () => resolve();

      scriptElement.onerror = (error: Event) => reject(error);
    });
  }

  protected async createScriptElement() {
    const script = this._document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
    script.id = this._SCRIPT_ID;
    script.src = await this._getScriptSrc(this.callbackName);
    return script;
  }

  protected async _getScriptSrc(callbackName: string): Promise<string> {
    const config = await this._config.toPromise();
    const protocolType: GoogleMapsScriptProtocol =
      (config && config.protocol) || GoogleMapsScriptProtocol.HTTPS;
    let protocol: string;

    switch (protocolType) {
      case GoogleMapsScriptProtocol.AUTO:
        protocol = '';
        break;
      case GoogleMapsScriptProtocol.HTTP:
        protocol = 'http:';
        break;
      case GoogleMapsScriptProtocol.HTTPS:
        protocol = 'https:';
        break;
    }

    const hostAndPath: string =
      config.hostAndPath || 'maps.googleapis.com/maps/api/js';
    const queryParams: { [key: string]: string | Array<string> } = {
      v: config.apiVersion || 'quarterly',
      callback: callbackName,
      key: config.apiKey,
      client: config.clientId,
      channel: config.channel,
      libraries: config.libraries,
      region: config.region,
      language: config.language,
    };
    const params: string = Object.keys(queryParams)
      .filter((k: string) => queryParams[k] != null)
      .filter((k: string) => 
        // remove empty arrays
         (
          !Array.isArray(queryParams[k]) ||
          (Array.isArray(queryParams[k]) && queryParams[k].length > 0)
        )
      )
      .map((k: string) => {
        // join arrays as comma seperated strings
        const i = queryParams[k];
        if (Array.isArray(i)) {
          return { key: k, value: i.join(',') };
        }
        return { key: k, value: queryParams[k] };
      })
      .map((entry: { key: string; value: string }) => `${entry.key}=${entry.value}`)
      .join('&');
    return `${protocol}//${hostAndPath}?${params}`;
  }
}
