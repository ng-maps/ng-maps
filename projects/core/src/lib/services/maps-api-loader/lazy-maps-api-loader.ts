import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Optional } from '@angular/core';
import {
  GoogleMapsScriptProtocol,
  LAZY_MAPS_API_CONFIG,
  LazyMapsAPILoaderConfigLiteral,
} from './lazy-maps-api-loader-config';

import { MapsAPILoader } from './maps-api-loader';

@Injectable()
export class LazyMapsAPILoader extends MapsAPILoader {
  protected _scriptLoadingPromise: Promise<void>;
  protected _config: LazyMapsAPILoaderConfigLiteral;
  protected _document: Document;
  protected readonly _SCRIPT_ID: string = 'GoogleMapsApiScript';
  protected readonly callbackName: string = `LazyMapsAPILoader`;

  constructor(
    @Optional()
    @Inject(LAZY_MAPS_API_CONFIG)
    config: LazyMapsAPILoaderConfigLiteral = null,
    @Inject(DOCUMENT) document: any,
  ) {
    super();
    this._config = config || {};
    this._document = document as Document;
  }

  load(): Promise<void> {
    if ((window as any).google && (window as any).google.maps) {
      // Google maps already loaded on the page.
      return Promise.resolve();
    }

    if (this._scriptLoadingPromise) {
      return this._scriptLoadingPromise;
    }

    // this can happen in HMR situations or Stackblitz.io editors.
    const scriptOnPage = this._document.getElementById(this._SCRIPT_ID);
    if (scriptOnPage) {
      this._assignScriptLoadingPromise(scriptOnPage);
      return this._scriptLoadingPromise;
    }

    const script = this._document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
    script.id = this._SCRIPT_ID;
    script.src = this._getScriptSrc(this.callbackName);
    this._assignScriptLoadingPromise(script);
    this._document.body.appendChild(script);
    return this._scriptLoadingPromise;
  }

  private _assignScriptLoadingPromise(scriptElem: HTMLElement) {
    this._scriptLoadingPromise = new Promise<void>((resolve, reject) => {
      window[this.callbackName] = () => {
        resolve();
      };

      scriptElem.onerror = (error: Event) => {
        reject(error);
      };
    });
  }

  protected _getScriptSrc(callbackName: string): string {
    const protocolType: GoogleMapsScriptProtocol =
      (this._config && this._config.protocol) || GoogleMapsScriptProtocol.HTTPS;
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
      this._config.hostAndPath || 'maps.googleapis.com/maps/api/js';
    const queryParams: { [key: string]: string | Array<string> } = {
      v: this._config.apiVersion || 'quarterly',
      callback: callbackName,
      key: this._config.apiKey,
      client: this._config.clientId,
      channel: this._config.channel,
      libraries: this._config.libraries,
      region: this._config.region,
      language: this._config.language,
    };
    const params: string = Object.keys(queryParams)
      .filter((k: string) => queryParams[k] != null)
      .filter((k: string) => {
        // remove empty arrays
        return (
          !Array.isArray(queryParams[k]) ||
          (Array.isArray(queryParams[k]) && queryParams[k].length > 0)
        );
      })
      .map((k: string) => {
        // join arrays as comma seperated strings
        const i = queryParams[k];
        if (Array.isArray(i)) {
          return { key: k, value: i.join(',') };
        }
        return { key: k, value: queryParams[k] };
      })
      .map((entry: { key: string; value: string }) => {
        return `${entry.key}=${entry.value}`;
      })
      .join('&');
    return `${protocol}//${hostAndPath}?${params}`;
  }
}
