import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  userId: number | undefined;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {
    // Check if user is authenticated, redirect if not
    if (!this.authService.currentUserValue) {
      this.router.navigate(['/guest/login']); // Redirect to login if user is not authenticated
    }
  }

  ngOnInit(): void {
    // Retrieve user ID from AuthService
    this.userId = this.authService.userId; // Use the userId getter
  }

  onSubmit() {
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = "New passwords do not match.";
      return;
    }

    const payload = {
      oldPassword: this.currentPassword,
      newPassword: this.newPassword,
    };

    this.http.put(`http://localhost:8005/users/${this.userId}/change-password`, payload, {
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}` // Ensure this method returns the current JWT
      }
    }).subscribe({
      next: () => {
        this.successMessage = "Password changed successfully.";
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = "Failed to change password. " + (err.error.message || "Unknown error"); // Adjust based on your error response
        this.successMessage = '';
      }
    });
  }
}
