import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgressTrackerService {

steps = [
    { label: 'Basic Info' },
    { label: 'Secondary Contact' },
    { label: 'Qualification' },
    { label: 'Experience' },
    { label: 'Course' },
    { label: 'Fees' },
    { label: 'Feestructure' }
  ];

  private currentStepSubject = new BehaviorSubject<number>(0);
  currentStep$ = this.currentStepSubject.asObservable();

  constructor() {}

  /** Update current step */
  setStep(index: number) {
    this.currentStepSubject.next(index);
  }

  /** Calculate progress */
  getProgressValue(index: number): number {
    return (index / (this.steps.length - 1)) * 100;
  }
}
