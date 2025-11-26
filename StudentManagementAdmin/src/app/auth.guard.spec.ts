import { TestBed } from '@angular/core/testing';
//import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let mockRouter: any;

  beforeEach(() => {
    mockRouter = { navigate: jasmine.createSpy('navigate') };

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: mockRouter }
      ]
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should return true if token exists', () => {
    spyOn(localStorage, 'getItem').and.returnValue('mock-token');
    expect(guard.canActivate()).toBeTrue();
  });

  it('should return false and redirect if no token', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    expect(guard.canActivate()).toBeFalse();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
});
