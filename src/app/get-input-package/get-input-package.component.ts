import { Component } from '@angular/core';

import { GetBundleSizeService } from './../shared/get-bundle-size.service';
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

  constructor(
    private getPackageSuggestionsService: GetPackageSuggestionsService,
    private getBundleSizeService: GetBundleSizeService
  ) { }

  getPackageSuggestion() {
    this.listPackages$ = this.getPackageSuggestionsService.getSuggestions(this.npmPackageName);
  }

  fetchData(npmPackage) {
    this.packageSelected = npmPackage.package;
    this.getBundleSizeService.getBundleData(this.packageSelected.name).subscribe(
      (data) => {
        console.log("Server data", data);
      }
    );
  }

}
