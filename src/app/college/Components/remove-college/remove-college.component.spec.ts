import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveCollegeComponent } from './remove-college.component';

describe('RemoveCollegeComponent', () => {
  let component: RemoveCollegeComponent;
  let fixture: ComponentFixture<RemoveCollegeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RemoveCollegeComponent]
    });
    fixture = TestBed.createComponent(RemoveCollegeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
