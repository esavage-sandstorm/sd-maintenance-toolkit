import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { DataService } from '../data.service';

@Component({
  selector: 'test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  data: any = {};
  testing: boolean = false;

  constructor(protected api: ApiService, protected dataService: DataService) { }

  ngOnInit(): void {
    this.data = this.dataService.data().subscribe((data: any) => {
      this.data = data;
      console.log('subscribe', data);
    });
  }

}
