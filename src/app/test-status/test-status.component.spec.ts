import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestStatusComponent } from './test-status.component';

describe('TestStatusComponent', () => {
  let component: TestStatusComponent;
  let fixture: ComponentFixture<TestStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
