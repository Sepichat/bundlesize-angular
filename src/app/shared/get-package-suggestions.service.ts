import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GetPackageSuggestionsService {

  constructor(private http: HttpClient) { }

  getSuggestions(packageName: string) {
    const params = new HttpParams().set('q', packageName);
    return this.http.get('https://api.npms.io/v2/search/suggestions', {params});
  }
}
