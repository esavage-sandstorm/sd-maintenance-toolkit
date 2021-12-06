import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../api.service';
import { DataService } from '../data.service';
@Component({
  selector: 'test-status',
  templateUrl: './test-status.component.html',
  styleUrls: ['./test-status.component.scss']
})


export class TestStatusComponent{
  status: any = {};
  data: any = {};
  testing: boolean = false;
  submitForm: boolean = false;
  @Input() client: any = {};

  constructor(protected api: ApiService, protected dataService: DataService) { }

  ngOnInit(): void {
    const self = this;
    this.data = this.dataService.data().subscribe((data: any) => {
      self.status = data.status;
    });
  }

  updateData(){
    this.dataService.update({status: this.status});
  }
  testFormSubmissionsTested() {
    if (this.submitForm){
      this.status.formSubmissionsTested = 'test';
      this.updateData();
    } else {
      this.status.formSubmissionsTested = 'skipped';
    }
  }

  testdrupal7Status() {
    const data = {
      url: this.client.url,
      username: this.client.username,
      password: this.client.password//"firstStorm#99"
    };
    this.status.cronLastRun = 'testing...';
    this.status.fileSystemPermissions = 'testing...';
    this.status.configFileProtected = 'testing...';
    this.status.accesstoUpdatePhp = 'testing...';
    return this.api.post('site/drupal7-maintenance', data).then( (result: any) => {
      // console.log(result);
      this.status.cronLastRun = result.status.Cronmaintenancetasks;
      this.status.fileSystemPermissions = result.status.Filesystem;
      this.status.configFileProtected = result.status.Configurationfile;
      this.status.accesstoUpdatePhp = result.status.Accesstoupdatephp;
      this.updateData();
      this.dataService.update({moduleUpdates: result.modules});
    });
  }
  testGoogleAnalyticsReporting() {
    const data = {url: this.client.url};
    this.status.googleAnalyticsReporting = 'testing...';
    return this.api.post('site/google-analytics', data).then( (result: any) => {
      this.status.googleAnalyticsReporting = result;
      this.updateData();
    });
  }
  testProdSSLExp() {
    const data = {url: this.client.url.replace('https://','').replace('http://','').replace('www.','')};
    this.status.prodSSLExp = 'testing...';
    return this.api.post('site/ssl-expiration', data).then( (result: any) => {
      this.status.prodSSLExp = result;
      this.updateData();
    });
  }
  testOpCacheEnabled() {
    const data = {module_name: 'Zend OPcache'};
    this.status.opCacheEnabled = 'testing...';
    return this.api.post('server/php-module', data).then( (result: any) => {
      this.status.opCacheEnabled = result;
      this.updateData();
    });
  }

  testAll() {
    const self = this;
    self.testing = true;
    self.testGoogleAnalyticsReporting().then((result: any) => {
      self.testProdSSLExp().then((result: any) => {
        self.testOpCacheEnabled().then((result: any) => {
          self.testdrupal7Status().then((result: any) => {
            self.testing = false;
          });
        });
      });
    });
  }
}
