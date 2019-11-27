import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PackageData } from './../model/package-data';

@Injectable({
  providedIn: 'root'
})
export class GetBundleSizeService {

  public readonly getBundleDataURL = '/bundle/packageSize';
  constructor(
    private http: HttpClient
  ) { }

  getBundleData(packageName) {
    const params = new HttpParams().set('q', packageName);
    return this.http.get(this.getBundleDataURL, {params}) as Observable<PackageData>;
  }
}
