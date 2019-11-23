import { Component } from '@angular/core';

import { GetPackageSuggestionsService } from './../shared/get-package-suggestions.service';

@Component({
  selector: 'app-get-input-package',
  templateUrl: './get-input-package.component.html',
  styleUrls: ['./get-input-package.component.scss']
})
export class GetInputPackageComponent {

  public npmPackageName: string;
  public packageSelected = null;
  public listPackages$;

  constructor(private getPackageSuggestionsService: GetPackageSuggestionsService) { }

  getPackageSuggestion() {
    this.listPackages$ = this.getPackageSuggestionsService.getSuggestions(this.npmPackageName);
  }

  fetchData(npmPackage) {
    this.packageSelected = npmPackage.package;
    console.log(npmPackage);
  }

}
