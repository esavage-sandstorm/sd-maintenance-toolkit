import { Component, OnInit } from '@angular/core';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'sd-maintenance-toolkit';
  client: any = {
    url: 'https://crowncork.com',
    username: 'stormtrooper',
    password: ''
  };
  data: any = {};
  dataSubscription: any = {};

  constructor(protected dataService: DataService) { }

  ngOnInit(): void {
    const self = this;
    this.dataSubscription = this.dataService.data().subscribe((data: any) => {
      self.data = data;
    });
  }
}
