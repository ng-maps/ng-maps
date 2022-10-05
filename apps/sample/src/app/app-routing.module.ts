import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { BoundsPaddingComponent } from './bounds-padding/bounds-padding.component';
import { ClusterWithWindowComponent } from './cluster-with-window/cluster-with-window.component';
import { ClusterComponent } from './cluster/cluster.component';
import { FitBoundsComponent } from './fit-bounds/fit-bounds.component';
import { InfoWindowComponent } from './info-window/info-window.component';
import { LayersComponent } from './layers/layers.component';
import { ShapesComponent } from './shapes/shapes.component';
import { SimpleMapComponent } from './simple-map/simple-map.component';
import { SnazzyInfoWindowComponent } from './snazzy-info-window/snazzy-info-window.component';

const routes: Routes = [
  {
    path: '',
    component: SimpleMapComponent,
  },
  {
    path: 'cluster',
    component: ClusterComponent,
  },
  {
    path: 'cluster-with-window',
    component: ClusterWithWindowComponent,
  },
  {
    path: 'info-window',
    component: InfoWindowComponent,
  },
  {
    path: 'shapes',
    component: ShapesComponent,
  },
  {
    path: 'fit-bounds',
    component: FitBoundsComponent,
  },
  {
    path: 'layers',
    component: LayersComponent,
  },
  {
    path: 'snazzy-info-window',
    component: SnazzyInfoWindowComponent,
  },
  {
    path: 'bounds-padding',
    component: BoundsPaddingComponent,
  },
  {
    path: 'autocomplete',
    component: AutocompleteComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
