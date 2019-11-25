import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

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
    return this.http.get('/bundle/packageSize', {params});
  }
}
