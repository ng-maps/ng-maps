import { Injectable } from '@angular/core';

@Injectable()
export abstract class MapsAPILoader {
  protected _window: Window;
  protected _document: Document;
  abstract load(): Promise<void>;
  abstract configure(config: any): void;
}
