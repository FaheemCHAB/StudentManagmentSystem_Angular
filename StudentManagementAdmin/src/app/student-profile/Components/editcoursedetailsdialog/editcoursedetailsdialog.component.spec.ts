import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditcoursedetailsdialogComponent } from './editcoursedetailsdialog.component';

describe('EditcoursedetailsdialogComponent', () => {
  let component: EditcoursedetailsdialogComponent;
  let fixture: ComponentFixture<EditcoursedetailsdialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditcoursedetailsdialogComponent]
    });
    fixture = TestBed.createComponent(EditcoursedetailsdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
