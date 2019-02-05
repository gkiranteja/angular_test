import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsAndPolacyComponent } from './terms-and-polacy.component';

describe('TermsAndPolacyComponent', () => {
  let component: TermsAndPolacyComponent;
  let fixture: ComponentFixture<TermsAndPolacyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermsAndPolacyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsAndPolacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
