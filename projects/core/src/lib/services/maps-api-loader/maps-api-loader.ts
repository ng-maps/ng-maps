import { Injectable } from '@angular/core';

@Injectable()
export abstract class MapsAPILoader {
  protected _window: Window;
  protected _document: Document;
  public abstract load(): Promise<void>;
  public abstract configure(config: any): void;
}
