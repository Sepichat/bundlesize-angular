import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { PackageData } from './../model/package-data';
import { GetBundleSizeService } from './../shared/get-bundle-size.service';
import { GetPackageSuggestionsService } from './../shared/get-package-suggestions.service';
import { GetBundleSizeServiceMock, GetPackageSuggestionsServiceMock } from './../shared/mock/services.mocks';
import { GetInputPackageComponent } from './get-input-package.component';

describe('GetInputPackageComponent', () => {
  let component: GetInputPackageComponent;
  let fixture: ComponentFixture<GetInputPackageComponent>;
  let packageData: PackageData;
  const versions = ['5.0.0', '1.0.0'];
  const sizes = [20 * 1024, 60 * 1024];
  const gzippedSizes = [10 * 1024, 30 * 1024];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [ GetInputPackageComponent ],
      providers: [
        { provide: GetPackageSuggestionsService, useClass: GetPackageSuggestionsServiceMock },
        { provide: GetBundleSizeService, useClass: GetBundleSizeServiceMock },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetInputPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    packageData = {
      name: 'test',
      listPackages: [{
        assets: {},
        gzippedSize: gzippedSizes[0],
        name: 'a',
        size: sizes[0],
        version: versions[0]
      }, {
        assets: {},
        gzippedSize: gzippedSizes[1],
        name: 'b',
        size: sizes[1],
        version: versions[1]
      }
    ]};
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset the selected data and call the service to get suggestions', () => {
    spyOn<any>(component['getPackageSuggestionsService'], 'getSuggestions');
    const packageName = 'foobar';
    component.npmPackageName = packageName;
    component.packageData = { name: 'test', listPackages: []};
    component.packageSelected = {name: 'test'};
    component.getPackageSuggestion();
    expect(component.packageData).toEqual(null);
    expect(component.packageSelected).toEqual(null);
    expect(component['getPackageSuggestionsService'].getSuggestions).toHaveBeenCalledWith(packageName);
  });

  it('should get the package size data', () => {
    spyOn<any>(component['getBundleSizeService'], 'getBundleData').and.returnValue(of({ name: 'test', listPackages: []}));
    spyOn(component, 'displayChart');
    const packageName = 'foobar';
    const packageObject = {
      package: {
        name: packageName
      }
    };
    component.fetchData(packageObject);
    expect(component['getBundleSizeService'].getBundleData).toHaveBeenCalledWith(packageName);
    expect(component.displayChart).toHaveBeenCalled();
  });

  it('should prepare the config for the chart', () => {
    const labels = ['label', 'otherLabel'];
    const sizes = [100, 200];
    const gzippedSizes = [10, 20];
    spyOn(component, 'getLabels').and.returnValue(labels);
    spyOn(component, 'getPackagesSize').and.returnValue(sizes);
    spyOn(component, 'getPackagesGzippedSize').and.returnValue(gzippedSizes);
    const config = component.prepareChartData();
    expect(config.type).toEqual('bar');
    expect(config.data.labels).toEqual(labels);
    expect(config.data.datasets[0].data).toEqual(gzippedSizes);
    expect(config.data.datasets[1].data).toEqual(sizes);
    expect(config.options.scales.xAxes[0].stacked).toEqual(true);
  });

  describe('when parsing the data for the chart', () => {
    it('should get the labels for the chart', () => {
      component.packageData = packageData;
      const labels = component.getLabels();
      expect(labels).toEqual(versions);
    });

    it('should get the size data for the chart', () => {
      component.packageData = packageData;
      const data = component.getPackagesSize();
      expect(data).toEqual(sizes.map(size => (size / 1024)));
    });

    it('should get gzipped size for the chart', () => {
      component.packageData = packageData;
      const data = component.getPackagesGzippedSize();
      expect(data).toEqual(gzippedSizes.map(size => (size / 1024)));
    });
  });

  it('should display the data on a chart', () => {
    component.packageData = packageData;
    component.packageSelected = {name: 'test'};
    fixture.detectChanges();
    spyOn(component, 'prepareChartData').and.returnValue({
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'Gzipped size',
          data: [1,2],
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }, {
          label: 'Bundled size',
          data: [5,10],
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
    });
    component.displayChart();
    expect(component.prepareChartData).toHaveBeenCalled();
  });
});
