import { Component, OnInit } from '@angular/core';
import { MARKERS } from './markers';

@Component({
  selector: 'app-cluster',
  templateUrl: './cluster.component.html',
  styleUrls: ['./cluster.component.css'],
})
export class ClusterComponent implements OnInit {
  public markers = MARKERS;

  constructor() {}

  ngOnInit() {}
}
