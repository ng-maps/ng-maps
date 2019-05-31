import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClusterComponent } from './cluster/cluster.component';
import { InfoWindowComponent } from './info-window/info-window.component';
import { SimpleMapComponent } from './simple-map/simple-map.component';

const routes: Routes = [
  {
    path: '',
    component: SimpleMapComponent
  },
  {
    path: 'cluster',
    component: ClusterComponent
  },
  {
    path: 'info-window',
    component: InfoWindowComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
