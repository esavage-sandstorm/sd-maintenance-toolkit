import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SdButtonComponent } from './sd-button.component';

describe('SdButtonComponent', () => {
  let component: SdButtonComponent;
  let fixture: ComponentFixture<SdButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SdButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SdButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
