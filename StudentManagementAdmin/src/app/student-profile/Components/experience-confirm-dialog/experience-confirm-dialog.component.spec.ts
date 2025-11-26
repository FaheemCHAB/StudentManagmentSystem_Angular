import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienceConfirmDialogComponent } from './experience-confirm-dialog.component';

describe('ExperienceConfirmDialogComponent', () => {
  let component: ExperienceConfirmDialogComponent;
  let fixture: ComponentFixture<ExperienceConfirmDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExperienceConfirmDialogComponent]
    });
    fixture = TestBed.createComponent(ExperienceConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
