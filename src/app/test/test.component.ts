import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { DataService } from '../data.service';
import { ClientService } from '../client.service';

@Component({
  selector: 'test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  data: any = {};
  testing: boolean = false;
  client: any = {};
  clientSubscription: any = {};

  constructor(protected api: ApiService, protected dataService: DataService, protected clientService: ClientService) { }

  ngOnInit(): void {
    this.dataService.data().subscribe((data: any) => {
      this.data = data;
    });
    this.clientService.data().subscribe((client: any) => {
      this.client = client;
    });
  }
}
