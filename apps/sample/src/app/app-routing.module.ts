import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BoundsPaddingComponent } from './bounds-padding/bounds-padding.component';
import { ClusterComponent } from './cluster/cluster.component';
import { CustomClusterComponent } from './cluster-custom/cluster.component';
import { ClusterWithWindowComponent } from './cluster-with-window/cluster-with-window.component';
import { DirectionComponent } from './direction/direction.component';
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
    path: 'custom-cluster',
    component: CustomClusterComponent,
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
    path: 'direction',
    component: DirectionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
