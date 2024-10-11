// eep-old.component.ts
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-eep-old',
  templateUrl: './eep-old.component.html',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  styleUrls: ['./eep-old.component.scss']
})
export class EepOldComponent implements OnInit {
  oldEepList: any[] = []; // Store old EEP users

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.loadOldEepUsers();
  }

  loadOldEepUsers(): void {
    // Fetch old EEP users from the service
    this.userService.getOldEepUsers().subscribe(
      (data) => {
        this.oldEepList = data;
      },
      (error) => {
        console.error('Error fetching old EEP users', error);
      }
    );
  }

  editEepUser(email: string) {
    // Navigate to edit component or handle edit logic using email or any other identifier
    this.router.navigate(['/edit-eep', email]); // Update with the actual route to edit EEP using email
  }

}
