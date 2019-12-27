import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';
import { MapsAPILoader } from './maps-api-loader';

/**
 * When using the NoOpMapsAPILoader, the Google Maps API must be added to the page via a `<script>`
 * Tag.
 * It's important that the Google Maps API script gets loaded first on the page.
 */
export class NoOpMapsAPILoader implements MapsAPILoader {
  protected _window: Window;
  protected _document: Document;

  constructor(@Inject(DOCUMENT) document: any) {
    this._document = document as Document;
    this._window = this._document.defaultView;
  }

  load(): Promise<void> {
    if (!(this._window as any).google || !(this._window as any).google.maps) {
      throw new Error(
        'Google Maps API not loaded on page. Make sure window.google.maps is available!',
      );
    }
    return Promise.resolve();
  }
}
