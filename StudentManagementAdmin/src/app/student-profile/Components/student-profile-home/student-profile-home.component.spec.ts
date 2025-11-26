import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentProfileHomeComponent } from './student-profile-home.component';

describe('StudentProfileHomeComponent', () => {
  let component: StudentProfileHomeComponent;
  let fixture: ComponentFixture<StudentProfileHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentProfileHomeComponent]
    });
    fixture = TestBed.createComponent(StudentProfileHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
