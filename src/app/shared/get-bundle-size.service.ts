import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PackageData } from './../model/package-data';

@Injectable({
  providedIn: 'root'
})
export class GetBundleSizeService {

  constructor(
    private http: HttpClient
  ) { }

  getBundleData(packageName) {
    console.log(packageName);
    const params = new HttpParams().set('q', packageName);
    return this.http.get('/bundle/packageSize', {params}) as Observable<PackageData>;
  }
}
