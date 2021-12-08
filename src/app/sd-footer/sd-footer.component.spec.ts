import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SdFooterComponent } from './sd-footer.component';

describe('SdFooterComponent', () => {
  let component: SdFooterComponent;
  let fixture: ComponentFixture<SdFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SdFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SdFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
