import { TestBed, inject } from '@angular/core/testing';

import { PopupServiceService } from './popup-service.service';

describe('PopupServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PopupServiceService]
    });
  });

  it('should be created', inject([PopupServiceService], (service: PopupServiceService) => {
    expect(service).toBeTruthy();
  }));
});
