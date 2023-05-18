import { Inject, Injectable, Optional } from '@angular/core';

import { MapsAPILoader, ScriptLoaderService } from '@ng-maps/core';

import {
  HereMapsLibraries,
  HereModuleOptions,
  HERE_MAPS_MODULE_OPTIONS,
} from './options';

@Injectable({
  providedIn: 'root',
})
export class HereMapsLoaderService extends MapsAPILoader {
  private readonly _modules = new Map([
    [HereMapsLibraries.CORE, ['js']],
    [HereMapsLibraries.SERVICE, ['js']],
    [HereMapsLibraries.MAPEVENTS, ['js']],
    [HereMapsLibraries.UI, ['js', 'css']],
    [HereMapsLibraries.CLUSTERING, ['js']],
    [HereMapsLibraries.DATA, ['js']],
    [HereMapsLibraries.PLACES, ['js']],
    [HereMapsLibraries.PANO, ['js']],
  ]);
  protected _configResolver: (config: HereModuleOptions) => void;
  protected config: Promise<HereModuleOptions>;

  constructor(
    // This may be a Promise but that doesn't work with ngc
    @Optional()
    @Inject(HERE_MAPS_MODULE_OPTIONS)
    config: any,
    private loader: ScriptLoaderService,
  ) {
    super();
    this.config = new Promise(
      (resolve, reject) => (this._configResolver = resolve),
    );
    if (config instanceof Promise) {
      config.then((c) => {
        this._configResolver(c);
      });
    } else if (typeof config === 'object') {
      this._configResolver(config);
    }
  }

  configure(config: HereModuleOptions): void {
    this._configResolver(config);
  }

  load(): Promise<void> {
    if (typeof H !== 'undefined') {
      return Promise.resolve();
    } else {
      return this.loadModules();
    }
  }

  private async loadModules(): Promise<void> {
    const config = await this.config;
    const libraries = config.libraries;
    const version = config.version;
    // Load the Core first, Service second and then the rest of the files
    await this.loadModule(HereMapsLibraries.CORE, version);
    await this.loadModule(HereMapsLibraries.SERVICE, version);
    await Promise.all(
      Array.isArray(libraries)
        ? libraries.map((moduleName) => this.loadModule(moduleName, version))
        : [],
    );
  }

  private async loadModule(
    moduleName: HereMapsLibraries,
    version?: string,
  ): Promise<any> {
    const mod = this._modules.get(moduleName);
    if (mod === void 0) {
      throw new Error(`Unknown module ${moduleName}`);
    }
    if (mod.includes('css')) {
      const cssurl = this.createModuleUrl(moduleName, version, 'css');
      await this.loader.loadCSS(cssurl);
    }
    const jsurl = this.createModuleUrl(moduleName, version);
    await this.loader.loadScript(jsurl);
  }

  private distinct(acc: Array<HereMapsLibraries>, next: HereMapsLibraries) {
    if (acc.find((value) => value === next)) {
      return acc;
    }
    return [...acc, next];
  }

  private createModuleUrl(
    module: HereMapsLibraries,
    version: string = '3.1',
    ext = 'js',
  ): string {
    const protocol = 'https:'; // (document.location as any).protocol,
    return `${protocol}//js.api.here.com/v3/${version}/mapsjs-${module}.${ext}`;
  }
}
