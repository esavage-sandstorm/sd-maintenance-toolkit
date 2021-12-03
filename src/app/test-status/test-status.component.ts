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
  testingSSL: boolean = false;
  prodSSLExp: string = '';
  testingOPcache: boolean = false;
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
    this.googleAnalyticsReporting = 'test';
  }
  testProdSSLExp() {
    const data = {url: 'crowncork.com'};
    this.testingSSL = true;
    this.api.post('server/ssl-expiration', data).then( (result: any) => {
      this.prodSSLExp = result;
      this.testingSSL = false;
    });
  }
  testOpCacheEnabled() {
    this.testingOPcache = true;
    const data = {module_name: 'Zend OPcache'};
    this.api.post('server/php-module', data).then( (result: any) => {
      this.opCacheEnabled = result;
      this.testingOPcache = false;
    });
  }
}
