import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRutasUserComponent } from './list-rutas-user.component';

describe('ListRutasUserComponent', () => {
  let component: ListRutasUserComponent;
  let fixture: ComponentFixture<ListRutasUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListRutasUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListRutasUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
