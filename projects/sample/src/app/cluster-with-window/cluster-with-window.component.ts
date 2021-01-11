import { Component, OnInit } from '@angular/core';
import { MARKERS } from '../cluster/markers';

@Component({
  selector: 'app-cluster-with-window',
  templateUrl: './cluster-with-window.component.html',
  styleUrls: ['./cluster-with-window.component.scss'],
})
export class ClusterWithWindowComponent implements OnInit {
  public markers = MARKERS;
  constructor() {}

  ngOnInit(): void {}
}
