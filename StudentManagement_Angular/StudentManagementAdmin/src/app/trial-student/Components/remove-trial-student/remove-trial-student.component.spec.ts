import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveTrialStudentComponent } from './remove-trial-student.component';

describe('RemoveTrialStudentComponent', () => {
  let component: RemoveTrialStudentComponent;
  let fixture: ComponentFixture<RemoveTrialStudentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RemoveTrialStudentComponent]
    });
    fixture = TestBed.createComponent(RemoveTrialStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
