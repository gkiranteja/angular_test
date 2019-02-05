import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetpswdComponent } from './resetpswd.component';

describe('ResetpswdComponent', () => {
  let component: ResetpswdComponent;
  let fixture: ComponentFixture<ResetpswdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetpswdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetpswdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
