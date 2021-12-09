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
      url : 'https://newclient.org'
    });
    this.clientService.clear();
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

  getFormData(form: any){
    const data = {
      url: form.url,
      id: form.id
    }
    console.log(data);
  }

}
