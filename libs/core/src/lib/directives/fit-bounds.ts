import {
  Directive,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Self,
  SimpleChanges,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import {
  FitBoundsAccessor,
  FitBoundsDetails,
  FitBoundsService,
} from '../services/fit-bounds';

/**
 * Adds the given directive to the auto fit bounds feature when the value is true.
 * To make it work with you custom AGM component, you also have to implement the {@link FitBoundsAccessor} abstract class.
 *
 * @example
 * <map-marker [mapFitBounds]="true"></map-marker>
 */
@Directive({
    selector: '[mapFitBounds]',
    standalone: false
})
export class NgMapsFitBoundsDirective implements OnInit, OnDestroy, OnChanges {
  /**
   * If the value is true, the element gets added to the bounds of the map.
   * Default: true.
   */
  @Input() public mapFitBounds: boolean = true;

  private _latestFitBoundsDetails: FitBoundsDetails | null = null;
  private subscription: Subscription = new Subscription();

  constructor(
    @Self() private readonly _fitBoundsAccessor: FitBoundsAccessor,
    private readonly _fitBoundsService: FitBoundsService,
  ) {}

  /**
   * @internal
   */
  public ngOnChanges(changes: SimpleChanges) {
    this._updateBounds();
  }

  /**
   * @internal
   */
  public ngOnInit() {
    this.subscription.add(
      this._fitBoundsAccessor
        .getFitBoundsDetails$()
        .pipe(
          distinctUntilChanged(
            (x: FitBoundsDetails, y: FitBoundsDetails) =>
              x.latLng.lat === y.latLng.lat && x.latLng.lng === y.latLng.lng,
          ),
        )
        .subscribe({
          next: (details) => this._updateBounds(details),
          complete: () => this._updateBounds(),
        }),
    );
  }

  /**
   * Either the location changed, or visible status changed.
   * Possible state changes are
   * invisible -> visible
   * visible -> invisible
   * visible -> visible (new location)
   */
  private _updateBounds(newFitBoundsDetails?: FitBoundsDetails) {
    // either visibility will change, or location, so remove the old one anyway
    if (this._latestFitBoundsDetails) {
      this._fitBoundsService.removeFromBounds(
        this._latestFitBoundsDetails.latLng,
      );
      // don't set latestFitBoundsDetails to null, because we can toggle visibility from
      // true -> false -> true, in which case we still need old value cached here
    }

    if (newFitBoundsDetails) {
      this._latestFitBoundsDetails = newFitBoundsDetails;
    }
    if (this._latestFitBoundsDetails) {
      if (this.mapFitBounds === true) {
        this._fitBoundsService.addToBounds(this._latestFitBoundsDetails.latLng);
      } else {
        this._fitBoundsService.removeFromBounds(
          this._latestFitBoundsDetails.latLng,
        );
      }
    }
  }

  /**
   * @internal
   */
  public ngOnDestroy() {
    this.subscription.unsubscribe();
    if (this._latestFitBoundsDetails !== null) {
      this._fitBoundsService.removeFromBounds(
        this._latestFitBoundsDetails.latLng,
      );
    }
  }
}
