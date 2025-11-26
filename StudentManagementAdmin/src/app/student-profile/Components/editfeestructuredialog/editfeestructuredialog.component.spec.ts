import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditfeestructuredialogComponent } from './editfeestructuredialog.component';

describe('EditfeestructuredialogComponent', () => {
  let component: EditfeestructuredialogComponent;
  let fixture: ComponentFixture<EditfeestructuredialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditfeestructuredialogComponent]
    });
    fixture = TestBed.createComponent(EditfeestructuredialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
