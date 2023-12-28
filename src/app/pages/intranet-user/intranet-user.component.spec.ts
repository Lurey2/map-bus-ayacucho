import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntranetUserComponent } from './intranet-user.component';

describe('IntranetUserComponent', () => {
  let component: IntranetUserComponent;
  let fixture: ComponentFixture<IntranetUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntranetUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntranetUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
