import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCollegeComponent } from './view-college.component';

describe('ViewCollegeComponent', () => {
  let component: ViewCollegeComponent;
  let fixture: ComponentFixture<ViewCollegeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewCollegeComponent]
    });
    fixture = TestBed.createComponent(ViewCollegeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
