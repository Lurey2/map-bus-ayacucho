import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapNearbyRouteComponent } from './map-nearby-route.component';

describe('MapNearbyRouteComponent', () => {
  let component: MapNearbyRouteComponent;
  let fixture: ComponentFixture<MapNearbyRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapNearbyRouteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapNearbyRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
