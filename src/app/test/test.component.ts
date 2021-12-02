import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  data: any = '';

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.api.get('nightmare-test').then(response => {
      this.data = response;
    });
  }

}
