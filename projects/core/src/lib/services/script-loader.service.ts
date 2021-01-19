import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScriptLoaderService {
  public document: Document;
  private head: HTMLHeadElement;
  private alreadyLoaded: Map<string, Promise<any>> = new Map();

  constructor(@Inject(DOCUMENT) document: any) {
    this.document = document as Document;
    this.head = this.document.head;
  }

  private observeLoad(
    element: HTMLScriptElement | HTMLLinkElement,
  ): Promise<UIEvent> {
    return new Promise((resolve, reject) => {
      function successHandler(event: UIEvent) {
        const readyState: string = (element as any).readyState;
        // For IE we have readyState, other browsers just call the load event and we proccede
        if (
          readyState === 'complete' ||
          readyState === 'loaded' ||
          event.type === 'load'
        ) {
          resolve(event);
        }
      }

      function errorHandler(event: UIEvent) {
        reject(event);
      }

      element.addEventListener('readystatechange', successHandler);
      element.addEventListener('load', successHandler);
      element.addEventListener('error', errorHandler);
    });
  }

  private createScriptElement(src: string): HTMLScriptElement {
    const script = document.createElement('script');
    script.src = src;
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
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
  public loadScript(src: string, integrity?: string): Promise<UIEvent | void> {
    if (this.alreadyLoaded.has(src)) {
      return this.alreadyLoaded.get(src);
    } else {
      const script = this.createScriptElement(src);
      const promise = this.observeLoad(script);
      this.head.appendChild(script);
      this.alreadyLoaded.set(src, promise);
      return promise;
    }
  }

  /**
   * Dynamically loads the given CSS file
   * @param href The url of the CSS to load dynamically
   * @returns Observable<UIEvent> Promise that will be resolved once the CSS file has been loaded.
   */
  public loadCSS(href: string): Promise<UIEvent | void> {
    // tslint:disable-line:naming-convention
    if (this.alreadyLoaded.has(href)) {
      return this.alreadyLoaded.get(href);
    } else {
      const style = this.createCSSElement(href);
      const promise = this.observeLoad(style);
      this.head.appendChild(style);
      this.alreadyLoaded.set(href, promise);
      return promise;
    }
  }
}
