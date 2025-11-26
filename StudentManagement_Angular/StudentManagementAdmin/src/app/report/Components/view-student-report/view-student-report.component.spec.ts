import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStudentReportComponent } from './view-student-report.component';

describe('ViewStudentReportComponent', () => {
  let component: ViewStudentReportComponent;
  let fixture: ComponentFixture<ViewStudentReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewStudentReportComponent]
    });
    fixture = TestBed.createComponent(ViewStudentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
