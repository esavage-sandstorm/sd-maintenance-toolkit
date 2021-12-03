import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: '[test-row]',
  templateUrl: './test-row.component.html',
  styleUrls: ['./test-row.component.scss']
})
export class TestRowComponent implements OnInit {
  @Input() value: string = '';
  @Input() note: string = '';
  @Input() noTest: boolean = false;
  @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();
  changeTO: any;
  @Input() label: string = '';
  @Output() test: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  clickTest(): void {
    this.value = 'testing...'
    this.test.emit();
  }

  update() {
    const self = this;
    clearTimeout(this.changeTO);
    this.changeTO = setTimeout(function(){
      self.valueChange.emit(self.value);
    }, 10);
  }

}
