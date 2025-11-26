import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditfeedialogComponent } from './editfeedialog.component';

describe('EditfeedialogComponent', () => {
  let component: EditfeedialogComponent;
  let fixture: ComponentFixture<EditfeedialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditfeedialogComponent]
    });
    fixture = TestBed.createComponent(EditfeedialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
