import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRutasComponent } from './list-rutas.component';

describe('ListRutasComponent', () => {
  let component: ListRutasComponent;
  let fixture: ComponentFixture<ListRutasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListRutasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListRutasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
