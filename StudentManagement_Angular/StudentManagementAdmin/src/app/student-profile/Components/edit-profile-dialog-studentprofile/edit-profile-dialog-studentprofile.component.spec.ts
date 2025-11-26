import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProfileDialogStudentprofileComponent } from './edit-profile-dialog-studentprofile.component';

describe('EditProfileDialogStudentprofileComponent', () => {
  let component: EditProfileDialogStudentprofileComponent;
  let fixture: ComponentFixture<EditProfileDialogStudentprofileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditProfileDialogStudentprofileComponent]
    });
    fixture = TestBed.createComponent(EditProfileDialogStudentprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
