import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SdHeaderComponent } from './sd-header.component';

describe('SdHeaderComponent', () => {
  let component: SdHeaderComponent;
  let fixture: ComponentFixture<SdHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SdHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SdHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
