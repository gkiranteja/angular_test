import { TestBed, inject } from '@angular/core/testing';

import { RegMenuDetailsService } from './reg-menu-details.service';

describe('RegMenuDetailsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RegMenuDetailsService]
    });
  });

  it('should be created', inject([RegMenuDetailsService], (service: RegMenuDetailsService) => {
    expect(service).toBeTruthy();
  }));
});
