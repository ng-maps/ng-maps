import { NgModule } from '@angular/core';
import { MapsAPILoader } from '@ng-maps/core';
import { ScriptLoaderModule } from 'ngx-script-loader';
import { GoogleMapsLoaderService } from './google-maps-loader.service';

@NgModule({
  declarations: [],
  imports: [ScriptLoaderModule],
  providers: [
    {
      provide: MapsAPILoader,
      useClass: GoogleMapsLoaderService,
    },
  ],
  exports: [],
})
export class GoogleMapsLoaderModule {}
