import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTrialStudentComponent } from './view-trial-student.component';

describe('ViewTrialStudentComponent', () => {
  let component: ViewTrialStudentComponent;
  let fixture: ComponentFixture<ViewTrialStudentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewTrialStudentComponent]
    });
    fixture = TestBed.createComponent(ViewTrialStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
