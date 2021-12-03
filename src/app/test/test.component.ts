import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  data: any = '';
  testing: boolean = false;

  constructor(protected api: ApiService) { }

  ngOnInit(): void {
  }

}
