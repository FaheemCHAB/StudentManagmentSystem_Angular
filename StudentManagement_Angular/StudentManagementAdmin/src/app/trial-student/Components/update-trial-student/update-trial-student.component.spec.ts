import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTrialStudentComponent } from './update-trial-student.component';

describe('UpdateTrialStudentComponent', () => {
  let component: UpdateTrialStudentComponent;
  let fixture: ComponentFixture<UpdateTrialStudentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateTrialStudentComponent]
    });
    fixture = TestBed.createComponent(UpdateTrialStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
