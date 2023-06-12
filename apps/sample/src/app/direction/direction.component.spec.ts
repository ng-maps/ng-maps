import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DirectionComponent } from './direction.component';

describe('DirectionComponent', () => {
  let component: DirectionComponent;
  let fixture: ComponentFixture<DirectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DirectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DirectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
