import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateQualificationComponent } from './update-qualification.component';

describe('UpdateQualificationComponent', () => {
  let component: UpdateQualificationComponent;
  let fixture: ComponentFixture<UpdateQualificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateQualificationComponent]
    });
    fixture = TestBed.createComponent(UpdateQualificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
