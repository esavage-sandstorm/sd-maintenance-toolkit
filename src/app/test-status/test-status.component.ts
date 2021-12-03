import { Component, OnInit } from '@angular/core';
import { TestComponent } from '../test/test.component';
@Component({
  selector: 'test-status',
  templateUrl: './test-status.component.html',
  styleUrls: ['./test-status.component.scss']
})
export class TestStatusComponent extends TestComponent {
  cronLastRun: string = '';
  fileSystemPermissions: string = '';
  configFileProtected: string = '';
  accesstoUpdatePhp: string = '';
  formSubmissionsTested: string = '';
  dbBackupRunning: string = '';
  siteUpdated: string = '';
  googleAnalyticsReporting: string = '';
  prodSSLExp: string = '';
  opCacheEnabled: string = '';


  testCronLastRun() {
    this.cronLastRun = 'test';
  }
  testFileSystemPermissions() {
    this.fileSystemPermissions = 'test';
  }
  testConfigFileProtected() {
    this.configFileProtected = 'test';
  }
  testAccesstoUpdatePhp() {
    this.accesstoUpdatePhp = 'test';
  }
  testFormSubmissionsTested() {
    this.formSubmissionsTested = 'test';
  }
  testDbBackupRunning() {
    this.dbBackupRunning = 'test';
  }
  testSiteUpdated() {
    this.siteUpdated = 'test';
  }
  testGoogleAnalyticsReporting() {
    const data = {url: 'https://www.crowncork.com'};
    this.api.post('site/google-analytics', data).then( (result: any) => {
      this.googleAnalyticsReporting = result;
    });
  }
  testProdSSLExp() {
    const data = {url: 'crowncork.com'};
    this.api.post('site/ssl-expiration', data).then( (result: any) => {
      this.prodSSLExp = result;
    });
  }
  testOpCacheEnabled() {
    const data = {module_name: 'Zend OPcache'};
    this.api.post('server/php-module', data).then( (result: any) => {
      this.opCacheEnabled = result;
    });
  }
}
