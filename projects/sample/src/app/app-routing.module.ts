import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClusterComponent } from './cluster/cluster.component';
import { FitBoundsComponent } from './fit-bounds/fit-bounds.component';
import { InfoWindowComponent } from './info-window/info-window.component';
import { LayersComponent } from './layers/layers.component';
import { ShapesComponent } from './shapes/shapes.component';
import { SimpleMapComponent } from './simple-map/simple-map.component';

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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
