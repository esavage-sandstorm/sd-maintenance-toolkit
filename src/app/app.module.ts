import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestComponent } from './test/test.component';
import { ReportComponent } from './report/report.component';
import { ReportStatusComponent } from './report-status/report-status.component';
import { TestStatusComponent } from './test-status/test-status.component';
import { TestRowComponent } from './test-row/test-row.component';


@NgModule({
  declarations: [
    AppComponent,
    TestComponent,
    ReportComponent,
    ReportStatusComponent,
    TestStatusComponent,
    TestRowComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
