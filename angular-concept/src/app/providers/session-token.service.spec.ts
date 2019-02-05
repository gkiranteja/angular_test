import { TestBed, inject } from '@angular/core/testing';

import { SessionTokenService } from './session-token.service';

describe('SessionTokenService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SessionTokenService]
    });
  });

  it('should be created', inject([SessionTokenService], (service: SessionTokenService) => {
    expect(service).toBeTruthy();
  }));
});
