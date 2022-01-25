import { Component, OnInit } from '@angular/core';
import { ClientService } from '../client.service';

@Component({
  selector: '[sd-footer]',
  templateUrl: './sd-footer.component.html',
  styleUrls: ['./sd-footer.component.scss']
})
export class SdFooterComponent implements OnInit {
  client: any = {};
  clientSubscription: any = {};

  constructor(protected clientService: ClientService) { }

  ngOnInit(): void {
    const self = this;
    this.clientSubscription = this.clientService.data().subscribe((client: any) => {
      self.client = client;
    });
  }

  clearClient() {
    this.clientService.clear();
  }

  year() {
    var d = new Date();
    return d.getFullYear();
  }

  v() {
    return 'v1.0.0'
  }
}
