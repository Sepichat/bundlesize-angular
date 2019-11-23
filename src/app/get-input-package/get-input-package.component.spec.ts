import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetInputPackageComponent } from './get-input-package.component';

describe('GetInputPackageComponent', () => {
  let component: GetInputPackageComponent;
  let fixture: ComponentFixture<GetInputPackageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetInputPackageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetInputPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
