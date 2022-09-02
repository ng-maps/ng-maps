import { NgModule } from '@angular/core';
import { MapsAPILoader, MAP_PROVIDER } from '@ng-maps/core';
import { MarkerClusterComponent } from './cluster/marker-cluster';
import { HereMapsLoaderService } from './here-maps-loader.service';
import { HereMapsPlatformProvider } from './here-maps-platform.provider';
import { HereComponent } from './here.component';

@NgModule({
  declarations: [HereComponent, MarkerClusterComponent],
  exports: [HereComponent, MarkerClusterComponent],
  providers: [
    HereMapsPlatformProvider,
    {
      provide: MapsAPILoader,
      useClass: HereMapsLoaderService,
    },
    {
      provide: MAP_PROVIDER,
      useValue: 'HereMaps',
    },
  ],
})
export class NgMapsHereModule {}
