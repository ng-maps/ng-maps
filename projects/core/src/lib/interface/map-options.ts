export interface MapOptions {
  draggable?: boolean;
  scrollwheel?: boolean;
  scaleControl?: boolean;
  zoomControl?: boolean;
  mapTypeControl?: boolean;
  zoom?: number;
  disableDoubleClickZoom?: boolean;

  /**
   * @todo fixme
   */
  [option: string]: any;
}
