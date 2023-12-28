import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketIconComponentComponent } from './market-icon-component.component';

describe('MarketIconComponentComponent', () => {
  let component: MarketIconComponentComponent;
  let fixture: ComponentFixture<MarketIconComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketIconComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketIconComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
