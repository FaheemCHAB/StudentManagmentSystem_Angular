import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveQualificationComponent } from './remove-qualification.component';

describe('RemoveQualificationComponent', () => {
  let component: RemoveQualificationComponent;
  let fixture: ComponentFixture<RemoveQualificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RemoveQualificationComponent]
    });
    fixture = TestBed.createComponent(RemoveQualificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
