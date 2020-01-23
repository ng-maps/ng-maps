import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { EMPTY, Observable, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScriptLoaderService {
  document: Document;
  private head: HTMLHeadElement;
  private alreadyLoaded = new Set<string>();

  constructor(@Inject(DOCUMENT) document: any) {
    this.document = document as Document;
    this.head = this.document.head;
  }

  private observeLoad(element: HTMLElement): Observable<UIEvent> {
    return new Observable((observer: Observer<UIEvent>) => {
      function successHandler(event: UIEvent) {
        const readyState: string = (element as any).readyState;
        // For IE we have readyState, other browsers just call the load event and we proccede
        if (
          readyState === 'complete' ||
          readyState === 'loaded' ||
          event.type === 'load'
        ) {
          observer.next(event);
          observer.complete();
        }
      }

      function errorHandler(event: UIEvent) {
        observer.error(event);
      }

      element.addEventListener('readystatechange', successHandler);
      element.addEventListener('load', successHandler);
      element.addEventListener('error', errorHandler);
    });
  }

  private createScriptElement(src: string): HTMLScriptElement {
    const script = document.createElement('script');
    script.src = src;
    return script;
  }

  // tslint:disable-next-line:naming-convention
  private createCSSElement(href: string): HTMLLinkElement {
    const style = document.createElement('link');

    style.rel = 'stylesheet';
    style.type = 'text/css';
    style.href = href;

    return style;
  }

  /**
   * Dynamically loads the given script
   * @param src The url of the script to load dynamically
   * @param integrity set integrity check value
   * @returns Observable<UIEvent> Observable that will be resolved once the script has been loaded.
   */
  public loadScript(src: string, integrity?: string): Observable<UIEvent> {
    if (this.alreadyLoaded.has(src)) {
      return EMPTY;
    } else {
      const script = this.createScriptElement(src);
      const observable = this.observeLoad(script);
      this.head.appendChild(script);
      this.alreadyLoaded.add(src);
      return observable;
    }
  }

  /**
   * Dynamically loads the given CSS file
   * @param href The url of the CSS to load dynamically
   * @returns Observable<UIEvent> Promise that will be resolved once the CSS file has been loaded.
   */
  public loadCSS(href: string): Observable<UIEvent> {
    // tslint:disable-line:naming-convention
    if (this.alreadyLoaded.has(href)) {
      return EMPTY;
    } else {
      const style = this.createCSSElement(href);
      const observable = this.observeLoad(style);
      this.head.appendChild(style);
      this.alreadyLoaded.add(href);
      return observable;
    }
  }

  private checkAlreadyLoadedScripts() {
    const scripts = this.head.getElementsByTagName('script');
    Array.from(scripts)
      .filter((script) => typeof script.src !== 'undefined')
      .forEach((script) => {
        this.alreadyLoaded.add(script.src);
      });
  }
}
