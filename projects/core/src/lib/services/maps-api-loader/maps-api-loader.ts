import { Injectable } from '@angular/core';
import { LazyMapsAPILoaderConfigLiteral } from '../../services';

@Injectable()
export abstract class MapsAPILoader {
  protected _window: Window;
  protected _document: Document;
  abstract load(): Promise<void>;
  abstract configure(config: LazyMapsAPILoaderConfigLiteral): void;
}
