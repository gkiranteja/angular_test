import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryDetailsComponent } from './libraryDetails.component';
import { TranslateModule } from '@ngx-translate/core';

describe('LibraryDetailsComponent', () => {
  let component: LibraryDetailsComponent;
  let fixture: ComponentFixture<LibraryDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LibraryDetailsComponent ],
      imports: [
        TranslateModule.forRoot()
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title in a h1 tag', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('PAGES.HOME.TITLE');
  }));
});
