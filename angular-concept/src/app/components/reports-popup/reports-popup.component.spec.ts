import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsPopupComponent } from './reports-popup.component';

describe('ReportsPopupComponent', () => {
  let component: ReportsPopupComponent;
  let fixture: ComponentFixture<ReportsPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportsPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
