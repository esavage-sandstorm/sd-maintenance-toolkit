import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  data: any = {
    site: 'NOW Foods',
    preparer: 'Eric Savage'
  };

  constructor() { }

  ngOnInit(): void {
  }

  date() {
    const now = new Date();
    const Y = now.getFullYear();
    const m = (now.getMonth() + 1).toString().padStart(2, '0');
    const d = now.getDate().toString().padStart(2, '0');

    return `${Y}-${m}-${d}`;
  }

}
