import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveCourseComponent } from './remove-course.component';

describe('RemoveCourseComponent', () => {
  let component: RemoveCourseComponent;
  let fixture: ComponentFixture<RemoveCourseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RemoveCourseComponent]
    });
    fixture = TestBed.createComponent(RemoveCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
