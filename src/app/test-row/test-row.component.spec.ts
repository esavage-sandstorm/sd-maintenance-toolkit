import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestRowComponent } from './test-row.component';

describe('TestRowComponent', () => {
  let component: TestRowComponent;
  let fixture: ComponentFixture<TestRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestRowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
