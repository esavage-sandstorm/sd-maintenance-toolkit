import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'button',
  templateUrl: './sd-button.component.html',
  styleUrls: ['./sd-button.component.scss']
})
export class SdButtonComponent implements OnInit {
  @Input() text: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
