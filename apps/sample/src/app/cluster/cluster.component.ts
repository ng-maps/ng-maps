import { Component } from '@angular/core';

import { MARKERS } from './markers';

@Component({
    selector: 'app-cluster',
    templateUrl: './cluster.component.html',
    styleUrls: ['./cluster.component.css'],
    standalone: false
})
export class ClusterComponent {
  public markers = MARKERS;
}
