import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestCmsComponent } from './test-cms.component';

describe('TestCmsComponent', () => {
  let component: TestCmsComponent;
  let fixture: ComponentFixture<TestCmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestCmsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestCmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
