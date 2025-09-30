import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // ✅ Import router
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  loginForm!: FormGroup;
  message = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router // ✅ Inject router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.http.post<any>(`${environment.baseurl}/login`, this.loginForm.value)
      .subscribe({
        next: (res) => {
          this.message = res?.message || 'Login successful';
          localStorage.setItem('token', res.token);
          this.loading = false;

          // ✅ Redirect to dashboard after success
          this.router.navigate(['/home']);
        },
        error: (err) => {
          this.loading = false;

          const backendMessage = err?.error?.message;
          if (backendMessage) {
            this.message = backendMessage;
          } else if (err.status === 404) {
            this.message = 'API endpoint not found (404)';
          } else {
            this.message = 'Login failed. Please check your server or credentials.';
          }
        }
      });
  }
}
