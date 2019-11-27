import { HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { GetPackageSuggestionsService } from './get-package-suggestions.service';

describe('GetPackageSuggestionsService', () => {
  let service: GetPackageSuggestionsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.get(GetPackageSuggestionsService)
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    // Finally, assert that there are no outstanding requests.
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call the npms api with the package name', () => {
    const packageName = 'myPackage';
    spyOn<any>(service['http'], 'get').and.callThrough();
    service.getSuggestions(packageName).subscribe();
    const req = httpMock.expectOne((request: HttpRequest<any>) => {
      return (
        request.url === service.getSuggestionURL &&
        request.params.has('q') &&
        request.params.get('q') === String(packageName)
      );
    }, 'getBundleData');
    req.flush({});
    expect(service['http'].get).toHaveBeenCalled();
  });
});
