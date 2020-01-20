import { GeoPoint } from './geo-point';

export interface MarkerOptions {
  position: GeoPoint;
  /**
   * not supported by here maps
   */
  label?: string | google.maps.MarkerLabel;
  /**
   * not supported by here maps
   */
  title?: string;
  visible?: boolean;
  zIndex?: number;
}
