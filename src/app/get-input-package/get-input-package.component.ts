import { Component } from '@angular/core';
import Chart from 'chart.js';

import { PackageData } from './../model/package-data';
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
  public packageData: PackageData | null = null;
  public chartId = 'packageChart';
  public isLoading = false;

  constructor(
    private getPackageSuggestionsService: GetPackageSuggestionsService,
    private getBundleSizeService: GetBundleSizeService
  ) { }

  getPackageSuggestion() {
    this.packageSelected = null;
    this.packageData = null;
    this.listPackages$ = this.getPackageSuggestionsService.getSuggestions(this.npmPackageName);
  }

  fetchData(npmPackage) {
    this.isLoading = true;
    this.packageSelected = npmPackage.package;
    this.getBundleSizeService.getBundleData(this.packageSelected.name).subscribe(
      data => {
        this.isLoading = false;
        this.packageData = data;
        this.displayChart();
      }
    );
  }

  prepareChartData() {
    const labels = this.getLabels();
    const size = this.getPackagesSize();
    const gzippedSize = this.getPackagesGzippedSize();
    return {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Gzipped size',
          data: gzippedSize,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }, {
          label: 'Bundled size',
          data: size,
          backgroundColor: 'rgba(255, 206, 86, 0.2)',
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 1
        }]
    },
    options: {
        scales: {
            xAxes: [{
              stacked: true
            }],
            yAxes: [{
              ticks: {
                beginAtZero: true,
              }
            }]
        }
      }
    };
  }

  getLabels() {
    return this.packageData.listPackages.map(npmPackage => (npmPackage.version));
  }

  getPackagesSize() {
    return this.packageData.listPackages.map(npmPackage => ((npmPackage.size / 1024).toFixed(1)));
  }

  getPackagesGzippedSize() {
    return this.packageData.listPackages.map(npmPackage => ((npmPackage.gzippedSize / 1024).toFixed(1)));
  }

  displayChart() {
    const chartContext = document.getElementById(this.chartId);
    if (chartContext) {
      const config = this.prepareChartData();
      const chart = new Chart(chartContext, config);
    }
  }

}
