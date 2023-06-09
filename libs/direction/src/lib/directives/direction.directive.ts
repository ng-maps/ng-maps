import {
  Directive,
  EventEmitter, Host, Inject,
  Input, NgZone,
  OnChanges,
  OnDestroy,
  OnInit, Optional,
  Output,
  SimpleChanges, SkipSelf,
} from '@angular/core';

import {
  MAP_PROVIDER,
  MapsAPILoader,
  MapsApiWrapper,
  MarkerManager,
  NgMapsMarkerComponent,
  NgMapsViewComponent,
} from '@ng-maps/core';

@Directive({
  selector: 'map-direction'
})
export class NgMapsDirectionDirective implements OnChanges, OnInit, OnDestroy {

  @Input() public origin?: string | google.maps.Place | google.maps.LatLng | google.maps.LatLngLiteral;

  @Input() public destination?: string | google.maps.Place | google.maps.LatLng | google.maps.LatLngLiteral;

  @Input() public travelMode?: google.maps.TravelMode;

  @Input() public transitOptions?: google.maps.TransitOptions;

  @Input() public drivingOptions?: google.maps.DrivingOptions;

  @Input() public waypoints: Array<google.maps.DirectionsWaypoint> = [];

  @Input() public optimizeWaypoints = true;

  @Input() public provideRouteAlternatives = false;

  @Input() public avoidHighways = false;

  @Input() public avoidTolls = false;

  @Input() public avoidFerries = false;

  @Input() public unitSystem?: google.maps.UnitSystem;

  @Input() public renderOptions?: google.maps.DirectionsRendererOptions;

  @Input() public panel?: Element;

  @Input() public markerOptions?: {
    origin: { infoWindow?: string | Node } & google.maps.MarkerOptions,
    destination: { infoWindow?: string | Node } & google.maps.MarkerOptions,
    waypoints?: Array<({ infoWindow?: string | Node } & google.maps.MarkerOptions)>,
  };

  @Input() public infoWindow?: google.maps.InfoWindow;

  // Remove or draw direction
  @Input() public visible = true;

  // Render exist direction
  @Input() public renderRoute?: google.maps.DirectionsResult | null;

  // Direction change event handler
  @Output() public directionChange: EventEmitter<google.maps.DirectionsResult> = new EventEmitter<google.maps.DirectionsResult>();

  // Direction response for the new request
  @Output() public directionResponse: EventEmitter<google.maps.DirectionsResult> = new EventEmitter<google.maps.DirectionsResult>();

  // Send a custom infowindow
  @Output() public sendInfoWindow: EventEmitter<google.maps.InfoWindow> = new EventEmitter<google.maps.InfoWindow>();

  // Status of Directions Query (google.maps.DirectionsStatus.OVER_QUERY_LIMIT)
  @Output() public status: EventEmitter<google.maps.DirectionsStatus> = new EventEmitter<google.maps.DirectionsStatus>();

  // Marker drag event handler
  @Output() public originDrag: EventEmitter<any> = new EventEmitter<any>();
  @Output() public destinationDrag: EventEmitter<any> = new EventEmitter<any>();

  public directionsService!: google.maps.DirectionsService;
  public directionsRenderer!: google.maps.DirectionsRenderer;

  // Use for custom marker
  private originMarker?: any;
  private destinationMarker?: any;
  private waypointsMarker: Array<google.maps.Marker> = [];

  // Use for visible flag
  private isFirstChange = true;
  private map: google.maps.Map = null;

  constructor(
    @Inject(MAP_PROVIDER) @SkipSelf() private mapProvider: string,
    private mapsApiWrapper: MapsApiWrapper,
    private mapsAPILoader: MapsAPILoader,
    protected zone: NgZone,
  ) { }

  ngOnInit(): void {
    if(this.mapProvider !== "GoogleMaps") {
      throw new Error("<map-direction> only support google-maps provider yet");
    }
  }

  ngOnChanges(obj: SimpleChanges): void {
    /**
     * When visible is false then remove the direction layer
     */
    if (!this.visible) {
      try {
        this.removeMarkers();
        this.removeDirections();
      } catch (e) { /* empty */ }
    } else {
      if (this.isFirstChange) {
        /**
         * When visible is false at the first time
         */
        if (typeof this.directionsRenderer === 'undefined') {
          this.directionDraw();
        }
        this.isFirstChange = false;
        return;
      }

      /**
       * When renderOptions are not first change then reset the display
       */
      if (typeof obj.renderOptions !== 'undefined') {
        if (obj.renderOptions.firstChange === false) {
          this.removeMarkers();
          this.removeDirections();
        }
      }
      this.directionDraw();
    }
  }

  ngOnDestroy() {
    this.destroyMarkers();
    this.removeDirections();
  }

  /**
   * This event is fired when the user creating or updating this direction
   */
  private async directionDraw() {

    await this.mapsAPILoader.load();
    this.map = await this.mapsApiWrapper.getNativeMap();

    if(this.map === null) {
      throw new Error("Missing map reference");
    }

    if(this.waypoints.length !== this.markerOptions.waypoints.length) {
      throw new Error("waypoints.length does not match markerOptions.waypoints.length");
    }

    if (typeof this.directionsRenderer === 'undefined') {
      this.directionsRenderer = new google.maps.DirectionsRenderer(this.renderOptions);
      this.directionsRenderer.setMap(this.map);
      this.directionsRenderer.addListener('directions_changed', () => {
        this.directionChange.emit(this.directionsRenderer.getDirections());
      });
    }

    if (typeof this.directionsService === 'undefined') {
      this.directionsService = new google.maps.DirectionsService();
    }

    if (typeof this.panel === 'undefined') {
      this.directionsRenderer.setPanel(null);
    } else {
      this.directionsRenderer.setPanel(this.panel as any);
    }

    // Render exist direction
    if (this.renderRoute) {
      this.directionsRenderer.setDirections(this.renderRoute);
      this.renderRoute = undefined;
    } else {

      // Request new direction
      this.directionsService.route({
        origin: this.origin,
        destination: this.destination,
        travelMode: this.travelMode || google.maps.TravelMode.DRIVING,
        transitOptions: this.transitOptions,
        drivingOptions: this.drivingOptions,
        waypoints: this.waypoints,
        optimizeWaypoints: this.optimizeWaypoints,
        provideRouteAlternatives: this.provideRouteAlternatives,
        avoidHighways: this.avoidHighways,
        avoidTolls: this.avoidTolls,
        avoidFerries: this.avoidFerries,
        unitSystem: this.unitSystem,
      }, async (response: any, status) => {

        this.directionResponse.emit(response);

        // Emit Query Status
        this.status.emit(status);

        /**
         * DirectionsStatus
         * https://developers.google.com/maps/documentation/javascript/directions#DirectionsStatus
         */
        switch (status) {
          case google.maps.DirectionsStatus.OK:

            this.directionsRenderer.setDirections(response);

            /**
             * Emit The DirectionsResult Object
             * https://developers.google.com/maps/documentation/javascript/directions?hl=en#DirectionsResults
             */
            // Custom Markers
            if (typeof this.markerOptions !== 'undefined') {

              this.destroyMarkers();

              // Set custom markers
              const _route = response.routes[0];

              console.log(_route);

              try {
                if (_route.legs.length === 0) {
                  console.warn('The webpage has sent too many requests within the allowed time period.');
                  return;
                }

                // Origin Marker
                if (typeof this.markerOptions.origin !== 'undefined') {
                  this.markerOptions.origin.map = this.map;
                  this.markerOptions.origin.position = _route.legs[0].start_location;
                  this.originMarker = this.setMarker(
                    this.map,
                    this.originMarker,
                    this.markerOptions.origin,
                    _route.legs[0].start_address,
                  );

                  if (this.markerOptions.origin.draggable) {
                    this.originMarker.addListener('dragend', () => {
                      this.origin = this.originMarker.position;
                      this.directionDraw();
                      this.originDrag.emit(this.origin);
                    });
                  }
                }

                // Destination Marker
                if (typeof this.markerOptions.destination !== 'undefined') {
                  this.markerOptions.destination.map = this.map;
                  this.markerOptions.destination.position = _route.legs[(_route.legs.length - 1)].end_location;
                  this.destinationMarker = this.setMarker(
                    this.map,
                    this.destinationMarker,
                    this.markerOptions.destination,
                    _route.legs[(_route.legs.length - 1)].end_address,
                  );
                  if (this.markerOptions.destination.draggable) {
                    this.destinationMarker.addListener('dragend', () => {
                      this.destination = this.destinationMarker.position;
                      this.directionDraw();
                      this.destinationDrag.emit(this.destination);
                    });
                  }
                }

                // Waypoints Marker
                if (typeof this.markerOptions !== 'undefined' && typeof this.markerOptions.waypoints !== 'undefined') {
                  let addedWaypointIndex = 0;
                  for (let i = 0; i < _route.legs.length; i++) {
                    const leg = _route.legs[i];
                    if (i !== (_route.legs.length - 1)) {

                      //Stopover: false - waypoints position equals leg.via_waypoint[j].location
                      for (let j = 0; j < leg.via_waypoint.length; j++) {
                        const via_waypoint = leg.via_waypoint[j];
                        this.markerOptions.waypoints[addedWaypointIndex].map = this.map;
                        this.markerOptions.waypoints[addedWaypointIndex].position = via_waypoint.location;
                        this.waypointsMarker[addedWaypointIndex] = this.setMarker(
                          this.map,
                          this.waypoints[addedWaypointIndex],
                          this.markerOptions.waypoints[addedWaypointIndex],
                          null,
                        );
                        addedWaypointIndex++
                      }

                      //Stopover: true - waypoints position equals leg.end_location
                      this.markerOptions.waypoints[addedWaypointIndex].map = this.map;
                      this.markerOptions.waypoints[addedWaypointIndex].position = leg.end_location;
                      this.waypointsMarker[addedWaypointIndex] = this.setMarker(
                        this.map,
                        this.waypoints[addedWaypointIndex],
                        this.markerOptions.waypoints[addedWaypointIndex],
                        leg.start_address,
                      );
                      addedWaypointIndex++
                    }
                  }
                }

              } catch (err) {
                console.error('MarkerOptions error.', err);
              }
            }

            break;

          case google.maps.DirectionsStatus.OVER_QUERY_LIMIT:
            console.warn('The webpage has sent too many requests within the allowed time period.');
            break;
          default:
            // console.warn(status);
            break;
        } // End switch
      });
    }
  }

  /**
   * Custom Origin and Destination Icon
   * @param map map
   * @param marker marker
   * @param markerOpts properties
   * @param content marker's infowindow content
   * @returns new marker
   */
  private setMarker(
    map: google.maps.Map,
    marker: google.maps.Marker | google.maps.DirectionsWaypoint,
    markerOpts: any,
    content: google.maps.LatLng | string
  ): google.maps.Marker {

    if (typeof this.infoWindow === 'undefined') {
      this.infoWindow = new google.maps.InfoWindow();
      this.sendInfoWindow.emit(this.infoWindow);
    }

    marker = new google.maps.Marker(markerOpts);
    // https://developers.google.com/maps/documentation/javascript/reference/marker?hl=zh-tw#MarkerOptions.clickable
    if (marker.getClickable()) {
      marker.addListener('click', () => {
        const infoWindowContent: string = typeof markerOpts.infoWindow === 'undefined' ? content : markerOpts.infoWindow;
        this.infoWindow.setContent(infoWindowContent);
        this.infoWindow.open(map, marker as google.maps.MVCObject);
      });
    }
    return marker;
  }

  /**
   * This event is fired when remove markers
   */
  private removeMarkers(): void {
    if (typeof this.originMarker !== 'undefined') {
      this.originMarker.setMap(null);
    }
    if (typeof this.destinationMarker !== 'undefined') {
      this.destinationMarker.setMap(null);
    }
    this.waypointsMarker.forEach((w: google.maps.Marker) => {
      if (typeof w !== 'undefined') {
        w.setMap(null);
      }
    });
  }

  /**
   * This event is fired when remove directions
   */
  private removeDirections(): void {
    if (this.directionsRenderer !== undefined) {
      this.directionsRenderer.setPanel(null);
      this.directionsRenderer.setMap(null);
      this.directionsRenderer = undefined;
    }
  }

  /**
   * This event is fired when destroy markers
   */
  private destroyMarkers(): void {
    // Remove origin markers
    try {
      if (typeof this.markerOptions !== 'undefined' && typeof this.originMarker !== 'undefined') {
        google.maps.event.clearListeners(this.originMarker, 'click');
        if (this.markerOptions.origin.draggable) {
          google.maps.event.clearListeners(this.originMarker, 'dragend');
        }
      }
      if (typeof this.markerOptions !== 'undefined' && typeof this.destinationMarker !== 'undefined') {
        google.maps.event.clearListeners(this.destinationMarker, 'click');
        if (this.markerOptions.origin.draggable) {
          google.maps.event.clearListeners(this.destinationMarker, 'dragend');
        }
      }
      this.waypointsMarker.forEach((w: google.maps.Marker) => {
        if (typeof w !== 'undefined') {
          google.maps.event.clearListeners(w, 'click');
        }
      });
      this.removeMarkers();

    } catch (err) {
      console.error('Can not reset custom marker.', err);
    }
  }
}
