import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { DataService } from '../data.service';
import { ClientService } from '../client.service';

@Component({
  selector: 'test-cms',
  templateUrl: './test-cms.component.html',
  styleUrls: ['./test-cms.component.scss']
})
export class TestCmsComponent implements OnInit {
  client: any = {};
  data: any = {};
  submitForm: boolean = false;
  constructor(protected api: ApiService, protected dataService: DataService, protected clientService: ClientService) { }

  ngOnInit(): void {
    this.dataService.data().subscribe((data: any) => {
      this.data = data;
    });
    this.clientService.data().subscribe((client: any) => {
      this.client = client;
    });
  }

  updateData(){
    this.dataService.update(this.data);
  }
  testFormSubmissionsTested() {
    if (this.submitForm){
      this.data.status.formSubmissionsTested = 'test';
      this.updateData();
    } else {
      this.data.status.formSubmissionsTested = 'skipped';
    }
  }

  testdrupal7Status() {
    const data = {
      url: this.client.url,
      username: this.client.cmsUser,
      password: this.client.cmsPassword
    };
    this.data.status.cronLastRun = 'testing...';
    this.data.status.fileSystemPermissions = 'testing...';
    this.data.status.configFileProtected = 'testing...';
    this.data.status.accesstoUpdatePhp = 'testing...';
    return this.api.post('site/drupal7-maintenance', data).then( (result: any) => {
      // console.log(result);
      this.data.status.cronLastRun = result.status.Cronmaintenancetasks;
      this.data.status.fileSystemPermissions = result.status.Filesystem;
      this.data.status.configFileProtected = result.status.Configurationfile;
      this.data.status.accesstoUpdatePhp = result.status.Accesstoupdatephp;
      this.updateData();
      this.dataService.update({moduleUpdates: result.modules});
    });
  }
}
