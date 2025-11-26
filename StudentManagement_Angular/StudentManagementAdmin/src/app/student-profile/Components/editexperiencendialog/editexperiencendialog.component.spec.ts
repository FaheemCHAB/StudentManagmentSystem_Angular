import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditexperiencendialogComponent } from './editexperiencendialog.component';

describe('EditexperiencendialogComponent', () => {
  let component: EditexperiencendialogComponent;
  let fixture: ComponentFixture<EditexperiencendialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditexperiencendialogComponent]
    });
    fixture = TestBed.createComponent(EditexperiencendialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
