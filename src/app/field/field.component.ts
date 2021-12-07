import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss']
})
export class FieldComponent implements OnInit {
  @Input() label: string = '';
  @Input() type: string = '';
  @Input() model: any;
  @Input() disabled: boolean = false;
  @Input() message?: string;
  @Input() error: string = '';
  @Input() required: boolean = false;
  @Input() style: string = '';
  @Input() inputStyle: string = '';
  @Input() validation: any;
  @Input() change: any;
  @Input() placeholder: string = '';
  @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() onFocus: EventEmitter<any>  = new EventEmitter<any>();
  @Output() onFocusOut: EventEmitter<any>  = new EventEmitter<any>();
  @Output() onKeyDown: EventEmitter<any>  = new EventEmitter<any>();
  changeTO: any;
  focus: boolean = false;
  initialModel: any;
  id: string = '';

  constructor() {
  }

  focusIn() {
    this.onFocus.emit();
    this.focus = true;
  }

  focusOut(){
    this.onFocusOut.emit();
    this.focus = false;
  }

  keyDown(e: any): void {
    this.onKeyDown.emit(e);
  }

  update() {
    const self = this;
    clearTimeout(this.changeTO);
    this.changeTO = setTimeout(function(){
      if (typeof self.change != 'undefined'){
        self.change(self.model);
      }
      self.modelChange.emit(self.model);
      self.validate();
    }, 10);
  }

  validate(){
    var self = this;
    if (self.error && typeof self.validation == 'undefined'){
      return false;
    } else if (self.model) {
      if (typeof self.validation != 'undefined' && self.validation(self.model)) {
        self.error = self.validation(self.model);
        return false;
      }
    } else if (self.required){
      self.error = "This field is required";
      return false;
    }
    self.error = '';
    return true;
  }

  reset() {
    this.model = this.initialModel;
    this.update();
  }

  ngOnInit(): void {
    if(this.label){
      this.id = 'field-' + this.label.toLowerCase().split(' ').join('-');
    } else {
      this.id = 'field-' + Math.floor(Math.random() * 1000);
    }
    this.update();
  }

  toTitleCase(str: string) {
    return str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }
}
