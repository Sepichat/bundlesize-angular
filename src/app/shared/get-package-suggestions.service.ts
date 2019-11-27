import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GetPackageSuggestionsService {
  public readonly getSuggestionURL = 'https://api.npms.io/v2/search/suggestions';

  constructor(private http: HttpClient) { }

  getSuggestions(packageName: string) {
    if (packageName) {
      const params = new HttpParams().set('q', packageName);
      return this.http.get(this.getSuggestionURL, {params});
    }
  }
}
