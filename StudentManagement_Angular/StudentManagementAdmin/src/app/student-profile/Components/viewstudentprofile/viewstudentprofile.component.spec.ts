import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewstudentprofileComponent } from './viewstudentprofile.component';

describe('ViewstudentprofileComponent', () => {
  let component: ViewstudentprofileComponent;
  let fixture: ComponentFixture<ViewstudentprofileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewstudentprofileComponent]
    });
    fixture = TestBed.createComponent(ViewstudentprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
