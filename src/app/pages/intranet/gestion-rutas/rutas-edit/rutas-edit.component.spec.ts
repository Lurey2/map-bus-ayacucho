import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RutasEditComponent } from './rutas-edit.component';

describe('RutasEditComponent', () => {
  let component: RutasEditComponent;
  let fixture: ComponentFixture<RutasEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RutasEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RutasEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
