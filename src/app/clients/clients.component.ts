import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ClientService } from '../client.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {
  clients: Array<any> = [];
  activeClient: any = {
    name: '',
    url : '',
    host: '',
    port: 22,
    sshUser: '',
    sshKeyFile: '',
    cms: '',
    cmsUser: '',
    cmsPassword: ''
  };
  clientSubscription: any = {};

  constructor(protected api: ApiService, protected clientService: ClientService){}
  ngOnInit(): void {
    this.getClients();
    const self = this;
    this.clientService.data().subscribe((client: any) => {
      self.activeClient = client;
    });
  }

  getClients(): void {
    this.api.post('client/all', null).then( (clients: any) => {
      this.clients = clients;
    });
  }

  selectClient(client: any) {
    this.activeClient = client;
    this.clientService.update(client);
  }

  newClient() {
    this.activeClient = {
      name: 'New Client',
      url : 'https://newclient.org',
      host: '',
      port: 22,
      sshUser: '',
      sshKeyFile: '',
      cms: '',
      cmsUser: '',
      cmsPassword: ''
    };
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

}
