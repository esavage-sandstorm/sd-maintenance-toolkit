import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ClientService } from '../client.service';
import { Client } from '../client';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {
  clients: Array<any> = [];
  activeClient: Client = new Client();
  clientSubscription: any = {};
  submitMsg: string = '';

  constructor(protected api: ApiService, protected clientService: ClientService){}
  ngOnInit(): void {
    this.getClients();
    const self = this;
    this.clientService.data().subscribe((client: any) => {
      self.activeClient.load(client);
    });
  }

  cmsChange() {
    if (!this.activeClient.cms.login_path){
      if (this.activeClient.cms.name.indexOf('Drupal') > -1) {
        this.activeClient.cms.login_path = '/user';
      }
      if (this.activeClient.cms.name.indexOf('WordPress') > -1) {
        this.activeClient.cms.login_path = '/wp-admin';
      }
      if (this.activeClient.cms.name.indexOf('Kentico') > -1) {
        this.activeClient.cms.login_path = '/admin';
      }
    }
  }

  getClients(): void {
    this.api.post('client/all', null).then( (clients: any) => {
      this.clients = clients;
    });
  }

  selectClient(client: any) {
    this.activeClient.load(client);
    this.clientService.update(client);
  }

  newClient() {
    this.activeClient.clear();
    this.activeClient.load({
      name: 'New Client',
      url : 'https://newclient.org',
      forms: []
    });
    this.clientService.clear();
  }

  fieldLabelFormat(raw: string): string{
    var label = raw.replace(/_+/gm, ' ');
    label = label.replace(/\[(.+)\]/gm, ` - $1`);
    label = label.replace(/(\b[a-z](?!\s))/g, function(x){return x.toUpperCase();});
    return label.trim();
  }

  saveClient() {
    const data = {
      client: this.activeClient
    }

    return this.api.post('client/save', data).then( (result: any) => {
      this.getClients();
      this.selectClient(this.activeClient);
    });
  }

  formDataPlaceholders(formData: any){
    var d = new Date();
    var q = 'Q' + Math.ceil((d.getMonth()+1) / 3);
    var y = d.getFullYear().toString();
    formData.forEach((field: any) => {
      field.value = field.value.replace('[[q]]', q);
      field.value = field.value.replace('[[y]]', y);
    });
    return formData;
  }

  sendFormData(i: number){
    var form = this.activeClient.forms[i];
    const self = this;

    form.formData = this.formDataPlaceholders(form.formData);
    this.api.post('site/test-form', form).then( (response: any) => {
      self.submitMsg = response;
    });
  }

  getFormData(i: number){
    var form = this.activeClient.forms[i];
    const data = {
      url: form.url,
      id: form.id
    }
    const self = this;
    this.api.post('site/get-form', data).then( (response: any) => {
      self.activeClient.forms[i].formData = response.form_data.filter((field: any) => {
        if (field.name.indexOf('captcha') > -1){
          return false
        }
        else if (field.name.indexOf('form') > -1) {
          return false;
        } else {
          return true;
        }
      });
    });
  }

}
