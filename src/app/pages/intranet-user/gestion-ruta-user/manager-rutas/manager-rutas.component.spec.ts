import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerRutasComponent } from './manager-rutas.component';

describe('ManagerRutasComponent', () => {
  let component: ManagerRutasComponent;
  let fixture: ComponentFixture<ManagerRutasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagerRutasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerRutasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
