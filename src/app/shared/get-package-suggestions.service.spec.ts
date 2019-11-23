import { TestBed } from '@angular/core/testing';

import { GetPackageSuggestionsService } from './get-package-suggestions.service';

describe('GetPackageSuggestionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetPackageSuggestionsService = TestBed.get(GetPackageSuggestionsService);
    expect(service).toBeTruthy();
  });
});
