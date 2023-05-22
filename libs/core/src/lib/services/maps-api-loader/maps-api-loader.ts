import { Injectable } from '@angular/core';

@Injectable()
export abstract class MapsAPILoader {
  protected _window?: Window | null;
  protected _document?: Document;
  public abstract load(): Promise<void>;
  public abstract configure(config: any): void;
}
