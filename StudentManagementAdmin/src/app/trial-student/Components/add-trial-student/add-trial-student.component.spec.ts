import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTrialStudentComponent } from './add-trial-student.component';

describe('AddTrialStudentComponent', () => {
  let component: AddTrialStudentComponent;
  let fixture: ComponentFixture<AddTrialStudentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddTrialStudentComponent]
    });
    fixture = TestBed.createComponent(AddTrialStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
