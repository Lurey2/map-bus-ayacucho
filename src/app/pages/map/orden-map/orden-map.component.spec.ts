import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenMapComponent } from './orden-map.component';

describe('OrdenMapComponent', () => {
  let component: OrdenMapComponent;
  let fixture: ComponentFixture<OrdenMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdenMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
