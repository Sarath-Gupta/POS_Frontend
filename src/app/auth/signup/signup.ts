import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { NotificationService } from '../../services/notification';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class SignupComponent {
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      this.notificationService.showError('Please provide a valid email and password (min 8 characters).', 'Invalid Form');
      return;
    }

    this.authService.signup(this.signupForm.value).subscribe({
      next: () => {
        this.notificationService.showSuccess('Signup successful! Please log in.');
        this.router.navigate(['/auth/login']);
      },
      error: (err) => this.notificationService.showError(err)
    });
  }
}