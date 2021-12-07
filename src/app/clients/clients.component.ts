import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {
  newClient: any = {
    name: 'Crown',
    url : 'https://crowncork.com',
    host: '172.99.75.203',
    port: 22,
    sshUser: 'crowndev',
    sshKeyFile: '/Users/ariksavage/.ssh/id_rsa',
    cms: 'Drupal 7',
    cmsUser: 'stormtrooper',
    cmsPassword: ''
  };

  constructor() { }

  ngOnInit(): void {
  }

  saveClient() {
    const data = {
      client: this.newClient
    }
    console.log(data);
    // return this.api.post('client/save', data).then( (result: any) => {
    //   console.log(result);
    // });
  }

}
