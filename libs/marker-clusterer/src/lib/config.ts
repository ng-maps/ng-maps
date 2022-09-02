import { InjectionToken } from '@angular/core';

export const MARKER_CLUSTER_CONFIG = new InjectionToken<MarkerClusterConfig>(
  'MARKER_CLUSTER_CONFIG',
);

export interface MarkerClusterConfig {
  imagePath: string;
}
