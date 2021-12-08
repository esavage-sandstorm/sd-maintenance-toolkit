import { Component, OnInit } from '@angular/core';
import { ClientService } from '../client.service';
import { Router } from '@angular/router';

@Component({
  selector: '[sd-header]',
  templateUrl: './sd-header.component.html',
  styleUrls: ['./sd-header.component.scss']
})
export class SdHeaderComponent implements OnInit {
  client: any = {};
  clientSubscription: any = {};

  constructor(protected clientService: ClientService, private router: Router) { }

  ngOnInit(): void {
    const self = this;
    this.clientSubscription = this.clientService.data().subscribe((client: any) => {
      self.client = client;
    });
  }

  isCurrent(url: string){
    return url == this.router.url;
  }
}
