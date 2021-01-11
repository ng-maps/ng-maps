import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClusterWithWindowComponent } from './cluster-with-window.component';

describe('ClusterWithWindowComponent', () => {
  let component: ClusterWithWindowComponent;
  let fixture: ComponentFixture<ClusterWithWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClusterWithWindowComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClusterWithWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
