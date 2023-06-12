import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';

import { MapsAPILoader } from './maps-api-loader';

/**
 * When using the NoOpMapsAPILoader, the Google Maps API must be added to the page via a `<script>`
 * Tag.
 * It's important that the Google Maps API script gets loaded first on the page.
 */
export class NoOpMapsAPILoader extends MapsAPILoader {
  constructor(@Inject(DOCUMENT) document: any) {
    super();
    this._document = document as Document;
    this._window = this._document.defaultView;
  }

  public load(): Promise<void> {
    return Promise.resolve();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public configure(config: any): void {}
}
