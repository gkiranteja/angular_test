import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightsNavigatorComponent } from './insights-navigator.component';

describe('InsightsNavigatorComponent', () => {
  let component: InsightsNavigatorComponent;
  let fixture: ComponentFixture<InsightsNavigatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsightsNavigatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsightsNavigatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
