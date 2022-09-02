import { NgZone } from '@angular/core';
import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { GoogleMapsAPIWrapper } from '@ng-maps/core';
import { NgMapsCircle } from '../directives/circle';
import { GoogleCircleManager } from './circle.manager';

describe('CircleManager', () => {
  beforeEach(() => {
    (window as any).google = {
      maps: {
        StrokePosition: { CENTER: 1, INSIDE: 0, OUTSIDE: 2 },
      },
    };
    TestBed.configureTestingModule({
      providers: [
        {
          provide: NgZone,
          useFactory: () => new NgZone({ enableLongStackTrace: true }),
        },
        GoogleCircleManager,
        {
          provide: GoogleMapsAPIWrapper,
          useValue: jasmine.createSpyObj('GoogleMapsAPIWrapper', [
            'createCircle',
          ]),
        },
      ],
    });
  });

  describe('Create a new circle', () => {
    it('should call the mapsApiWrapper when creating a new circle', inject(
      [GoogleCircleManager, GoogleMapsAPIWrapper],
      (
        circleManager: GoogleCircleManager,
        apiWrapper: jasmine.SpyObj<GoogleMapsAPIWrapper>,
      ) => {
        const newCircle = new NgMapsCircle(circleManager);
        newCircle.radius = 500;
        newCircle.latitude = 32.1;
        newCircle.longitude = 11.612;
        circleManager.addCircle(newCircle);

        expect(apiWrapper.createCircle).toHaveBeenCalled();
      },
    ));
  });

  describe('Create a new circle', () => {
    it('should call the mapsApiWrapper createCircle with correct args', inject(
      [GoogleCircleManager, GoogleMapsAPIWrapper],
      (
        circleManager: GoogleCircleManager,
        apiWrapper: jasmine.SpyObj<GoogleMapsAPIWrapper>,
      ) => {
        const newCircle = new NgMapsCircle(circleManager);
        newCircle.radius = 500;
        newCircle.latitude = 32.1;
        newCircle.longitude = 11.612;
        circleManager.addCircle(newCircle);

        expect(apiWrapper.createCircle).toHaveBeenCalledWith({
          center: {
            lat: 32.1,
            lng: 11.612,
          },
          radius: 500,
          clickable: true,
          draggable: false,
          editable: false,
          fillColor: undefined,
          fillOpacity: undefined,
          strokeColor: undefined,
          strokeOpacity: undefined,
          strokePosition: google.maps.StrokePosition.CENTER,
          strokeWeight: 0,
          visible: true,
          zIndex: undefined,
        });
      },
    ));
  });
  describe('Delete a circle', () => {
    it('should set the map to null when deleting a existing circle', fakeAsync(
      inject(
        [GoogleCircleManager, GoogleMapsAPIWrapper],
        (
          circleManager: GoogleCircleManager,
          apiWrapper: jasmine.SpyObj<GoogleMapsAPIWrapper>,
        ) => {
          const newCircle = new NgMapsCircle(circleManager);
          newCircle.radius = 500;
          newCircle.latitude = 32.1;
          newCircle.longitude = 11.612;
          circleManager.addCircle(newCircle);

          const circleInstance: any = {
            setMap: jasmine.createSpy(),
          };
          apiWrapper.createCircle.and.returnValue(
            Promise.resolve(circleInstance),
          );

          circleManager.addCircle(newCircle);
          circleManager.removeCircle(newCircle).then(() => {
            expect(circleInstance.setMap).toHaveBeenCalledWith(null);
          });
        },
      ),
    ));
  });

  describe('Set radius option', () => {
    it('should update that circle via setRadius method when the radius changes', fakeAsync(
      inject(
        [GoogleCircleManager, GoogleMapsAPIWrapper],
        (
          circleManager: GoogleCircleManager,
          apiWrapper: jasmine.SpyObj<GoogleMapsAPIWrapper>,
        ) => {
          const newCircle = new NgMapsCircle(circleManager);
          newCircle.radius = 500;
          newCircle.latitude = 32.1;
          newCircle.longitude = 11.612;

          const circleInstance: google.maps.Circle = {
            setMap: jasmine.createSpy(),
            setRadius: jasmine.createSpy(),
          } as any;
          apiWrapper.createCircle.and.returnValue(
            Promise.resolve(circleInstance),
          );
          circleManager.addCircle(newCircle);
          newCircle.radius = 600;

          circleManager.setRadius(newCircle);
          tick();
          expect(circleInstance.setRadius).toHaveBeenCalledWith(600);
        },
      ),
    ));
  });

  describe('Set options', () => {
    it('should update that circle via setOptions method when the opacity options change', fakeAsync(
      inject(
        [GoogleCircleManager, GoogleMapsAPIWrapper],
        (
          circleManager: GoogleCircleManager,
          apiWrapper: jasmine.SpyObj<GoogleMapsAPIWrapper>,
        ) => {
          const newCircle = new NgMapsCircle(circleManager);
          newCircle.radius = 500;
          newCircle.latitude = 32.1;
          newCircle.longitude = 11.612;
          newCircle.fillOpacity = 0.4;
          newCircle.strokeOpacity = 0.4;

          const circleInstance: any = {
            setMap: jasmine.createSpy(),
            setOptions: jasmine.createSpy(),
          };

          apiWrapper.createCircle.and.returnValue(
            Promise.resolve(circleInstance),
          );

          circleManager.addCircle(newCircle);

          newCircle.fillOpacity = 0.6;
          newCircle.strokeOpacity = 0.6;

          const options = {
            fillOpacity: 0.6,
            strokeOpacity: 0.6,
          };

          circleManager.setOptions(newCircle, options);
          tick();
          expect(circleInstance.setOptions).toHaveBeenCalledWith(options);
        },
      ),
    ));

    it('should update that circle via setOptions method when the color options change', fakeAsync(
      inject(
        [GoogleCircleManager, GoogleMapsAPIWrapper],
        (
          circleManager: GoogleCircleManager,
          apiWrapper: jasmine.SpyObj<GoogleMapsAPIWrapper>,
        ) => {
          const newCircle = new NgMapsCircle(circleManager);
          newCircle.radius = 500;
          newCircle.latitude = 32.1;
          newCircle.longitude = 11.612;
          newCircle.fillColor = '#ff7f50';
          newCircle.strokeColor = '#ff7f50';

          const circleInstance: any = {
            setMap: jasmine.createSpy(),
            setOptions: jasmine.createSpy(),
          };

          apiWrapper.createCircle.and.returnValue(
            Promise.resolve(circleInstance),
          );

          circleManager.addCircle(newCircle);
          newCircle.fillColor = '#00008b';
          newCircle.strokeColor = '#00008b';

          const options = {
            fillColor: '#00008b',
            strokeColor: '#00008b',
          };

          circleManager.setOptions(newCircle, options);
          tick();
          expect(circleInstance.setOptions).toHaveBeenCalledWith(options);
        },
      ),
    ));

    it('should update that circle via setOptions method when the strokeWeight/position change', fakeAsync(
      inject(
        [GoogleCircleManager, GoogleMapsAPIWrapper],
        (
          circleManager: GoogleCircleManager,
          apiWrapper: jasmine.SpyObj<GoogleMapsAPIWrapper>,
        ) => {
          const newCircle = new NgMapsCircle(circleManager);
          newCircle.radius = 500;
          newCircle.latitude = 32.1;
          newCircle.longitude = 11.612;
          newCircle.strokeWeight = 3;
          newCircle.strokePosition = 'INSIDE' as any;

          const circleInstance: any = {
            setMap: jasmine.createSpy(),
            setOptions: jasmine.createSpy(),
          };

          apiWrapper.createCircle.and.returnValue(
            Promise.resolve(circleInstance),
          );

          circleManager.addCircle(newCircle);

          const options = ({
            strokeWeight: 2,
            strokePosition: 'OUTSIDE',
          } as any) as Partial<google.maps.CircleOptions>;

          circleManager.setOptions(newCircle, options);
          tick();
          expect(circleInstance.setOptions).toHaveBeenCalledWith({
            strokeWeight: 2,
            strokePosition: 2,
          });
        },
      ),
    ));

    it('should update that circle via setVisible method when the visible changes', fakeAsync(
      inject(
        [GoogleCircleManager, GoogleMapsAPIWrapper],
        (
          circleManager: GoogleCircleManager,
          apiWrapper: jasmine.SpyObj<GoogleMapsAPIWrapper>,
        ) => {
          const newCircle = new NgMapsCircle(circleManager);
          newCircle.radius = 500;
          newCircle.latitude = 32.1;
          newCircle.longitude = 11.612;
          newCircle.visible = false;

          const circleInstance: any = {
            setMap: jasmine.createSpy(),
            setVisible: jasmine.createSpy(),
          };
          apiWrapper.createCircle.and.returnValue(
            Promise.resolve(circleInstance),
          );
          circleManager.addCircle(newCircle);

          newCircle.visible = true;
          circleManager.setVisible(newCircle);

          tick();
          expect(circleInstance.setVisible).toHaveBeenCalledWith(true);
        },
      ),
    ));
  });
});
