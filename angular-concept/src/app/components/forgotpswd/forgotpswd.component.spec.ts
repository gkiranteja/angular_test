import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotpswdComponent } from './forgotpswd.component';

describe('ForgotpswdComponent', () => {
  let component: ForgotpswdComponent;
  let fixture: ComponentFixture<ForgotpswdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgotpswdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotpswdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
