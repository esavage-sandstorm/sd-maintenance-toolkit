import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { ClientService } from './client.service';
import { DataService } from './data.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestComponent } from './test/test.component';
import { ReportComponent } from './report/report.component';
import { ReportStatusComponent } from './report-status/report-status.component';
import { TestStatusComponent } from './test-status/test-status.component';
import { TestRowComponent } from './test-row/test-row.component';
import { ClientsComponent } from './clients/clients.component';
import { FieldComponent } from './field/field.component';
import { SdButtonComponent } from './sd-button/sd-button.component';
import { SdHeaderComponent } from './sd-header/sd-header.component';
import { SdFooterComponent } from './sd-footer/sd-footer.component';
import { TestCmsComponent } from './test-cms/test-cms.component';
import { TestServerComponent } from './test-server/test-server.component';
import { TestSiteComponent } from './test-site/test-site.component';


@NgModule({
  declarations: [
    AppComponent,
    TestComponent,
    ReportComponent,
    ReportStatusComponent,
    TestStatusComponent,
    TestRowComponent,
    ClientsComponent,
    FieldComponent,
    SdButtonComponent,
    SdHeaderComponent,
    SdFooterComponent,
    TestCmsComponent,
    TestServerComponent,
    TestSiteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [ClientService, DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
