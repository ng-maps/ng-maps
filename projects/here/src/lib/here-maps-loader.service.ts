import { Inject, Injectable } from '@angular/core';
import {
  LazyMapsAPILoaderConfigLiteral,
  MapsAPILoader,
  ScriptLoaderService,
} from '@ng-maps/core';
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
  private libraries: Array<HereMapsLibraries>;

  constructor(
    @Inject(HERE_MAPS_MODULE_OPTIONS) private options: HereModuleOptions,
    private loader: ScriptLoaderService,
  ) {
    super();
    this.libraries = this.options.libraries;
  }

  configure(config: LazyMapsAPILoaderConfigLiteral): void {}

  load(): Promise<void> {
    return this.loadModules();
  }

  private async loadModules(): Promise<any> {
    // Load the Core first then the rest of the files
    await this.loadModule(HereMapsLibraries.CORE);
    return Promise.all(
      this.libraries
        .reduce(this.distinct, [])
        .map((moduleName) => this.loadModule(moduleName)),
    );
  }

  private async loadModule(
    moduleName: HereMapsLibraries,
  ): Promise<UIEvent | Error> {
    const mod = this._modules.get(moduleName);
    if (mod === void 0) {
      return new Error(`Unknown module ${moduleName}`);
    }
    if (mod.includes('css')) {
      const cssurl = this.createModuleUrl(moduleName, 'css');
      await this.loader.loadCSS(cssurl).toPromise();
    }
    const jsurl = this.createModuleUrl(moduleName);
    return this.loader.loadScript(jsurl).toPromise();
  }

  private distinct(acc: Array<HereMapsLibraries>, next: HereMapsLibraries) {
    if (acc.find((value) => value === next)) {
      return acc;
    }
    return [...acc, next];
  }

  private createModuleUrl(module: HereMapsLibraries, ext = 'js'): string {
    const protocol = 'https:'; // (document.location as any).protocol,
    const version = this.options.version || '3.1';
    return `${protocol}//js.api.here.com/v3/${version}/mapsjs-${module}.${ext}`;
  }
}
