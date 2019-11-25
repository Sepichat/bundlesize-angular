import { TestBed } from '@angular/core/testing';

import { GetBundleSizeService } from './get-bundle-size.service';

describe('GetBundleSizeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetBundleSizeService = TestBed.get(GetBundleSizeService);
    expect(service).toBeTruthy();
  });
});
