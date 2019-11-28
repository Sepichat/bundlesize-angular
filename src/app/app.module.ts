import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgxFilesizeModule } from 'ngx-filesize';

import { AppComponent } from './app.component';
import { GetInputPackageComponent } from './get-input-package/get-input-package.component';

@NgModule({
  declarations: [
    AppComponent,
    GetInputPackageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    NgxFilesizeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
