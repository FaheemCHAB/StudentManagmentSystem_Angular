import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditqualificationdialogComponent } from './editqualificationdialog.component';

describe('EditqualificationdialogComponent', () => {
  let component: EditqualificationdialogComponent;
  let fixture: ComponentFixture<EditqualificationdialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditqualificationdialogComponent]
    });
    fixture = TestBed.createComponent(EditqualificationdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
