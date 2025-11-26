import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodayDueComponent } from './today-due.component';

describe('TodayDueComponent', () => {
  let component: TodayDueComponent;
  let fixture: ComponentFixture<TodayDueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TodayDueComponent]
    });
    fixture = TestBed.createComponent(TodayDueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
