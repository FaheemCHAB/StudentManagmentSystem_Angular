import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteconfirmdialogComponent } from './deleteconfirmdialog.component';

describe('DeleteconfirmdialogComponent', () => {
  let component: DeleteconfirmdialogComponent;
  let fixture: ComponentFixture<DeleteconfirmdialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteconfirmdialogComponent]
    });
    fixture = TestBed.createComponent(DeleteconfirmdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
