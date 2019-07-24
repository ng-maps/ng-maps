import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MapsAPILoader } from '@ng-maps/core';
import { fromEventPattern, Subscription } from 'rxjs';

/**
 * @example
 * <input [mapAutocomplete]='options' (placeResult)='onPlacesResult($event)' />
 */
@Directive({
  selector: '[mapAutocomplete]',
})
export class NgMapsAutocompleteDirective
  implements OnInit, OnChanges, OnDestroy {
  /**
   * Configuration Input described by the AutocompleteOptions Interface
   * https://developers.google.com/maps/documentation/javascript/reference/3.exp/places-widget#AutocompleteOptions
   */
  // tslint:disable-next-line:no-input-rename
  @Input('mapAutocomplete')
  public config: google.maps.places.AutocompleteOptions;

  /**
   * This event is fired on selection of an element from the autocomplete list.
   * The event contains a PlaceResult from GoogleMapsAPI
   * https://developers.google.com/maps/documentation/javascript/reference/3.exp/places-service#PlaceResult
   */
  @Output() public placeResult: EventEmitter<
    google.maps.places.PlaceResult
  > = new EventEmitter<google.maps.places.PlaceResult>();

  /**
   * This event is fired on selection of an element from the autocomplete list.
   * The event contains a LatLngBounds from GoogleMapsAPI
   * https://developers.google.com/maps/documentation/javascript/reference/3.exp/coordinates#LatLngBounds
   */
  @Output() public bounds: EventEmitter<
    google.maps.LatLngBounds
  > = new EventEmitter<google.maps.LatLngBounds>();

  private autocomplete: google.maps.places.Autocomplete;
  private subscription: Subscription;

  constructor(
    private element: ElementRef,
    private mapsAPILoader: MapsAPILoader,
    private _zone: NgZone,
  ) {}

  /** @internal */
  public ngOnInit(): void {
    if (typeof this.config === 'undefined') {
      this.config = {
        types: ['address'],
      };
    }

    if (this.element.nativeElement instanceof HTMLInputElement) {
      this.init();
    } else {
      throw new Error('Directive can only be applied to an HTMLInputElement');
    }
  }

  /** @internal */
  async init() {
    await this.mapsAPILoader.load();
    this.autocomplete = new google.maps.places.Autocomplete(
      this.element.nativeElement,
      this.config,
    );
    this.subscription = fromEventPattern(
      (handler: any) => this.addHandler(handler),
      () => this.removeHandler(),
    ).subscribe({
      next: () => {
        this.placeResult.emit(this.autocomplete.getPlace());
        this.bounds.emit(this.autocomplete.getBounds());
      },
    });
  }

  /** @internal */
  ngOnChanges(changes: SimpleChanges): void {
    if (typeof changes.config !== 'undefined' && !changes.config.firstChange) {
      const config = changes.config
        .currentValue as google.maps.places.AutocompleteOptions;
      if (typeof config.bounds !== 'undefined') {
        this.autocomplete.setBounds(config.bounds);
      }
      if (typeof config.componentRestrictions !== 'undefined') {
        this.autocomplete.setComponentRestrictions(
          config.componentRestrictions,
        );
      }
      if (typeof config.types !== 'undefined') {
        this.autocomplete.setTypes(config.types);
      }
    }
  }

  /** @internal */
  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /** @internal */
  private addHandler(handler: (...args: Array<any>) => void) {
    return this.autocomplete.addListener('place_changed', () =>
      this._zone.run(handler),
    );
  }

  /** @internal */
  private removeHandler() {
    this.autocomplete.unbindAll();
  }
}
