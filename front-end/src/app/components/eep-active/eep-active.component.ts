import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service'; // Adjust the import based on your structure
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-eep-active',
  templateUrl: './eep-active.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./eep-active.component.scss']
})
export class EepActiveComponent implements OnInit {
  eepUsers: {
    name: string;
    email: string;
    sigle: string;
    raison: string;
    creationDate: Date;
    endDate: Date | null;
  }[] = []; // This initializes eepUsers as an empty array

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    console.log('Initial eepUsers:', this.eepUsers); // Log the initial state
    this.fetchEepUsers(); // Call the method to fetch EEP users when the component initializes
  }

  fetchEepUsers() {
    this.userService.getActiveEepUsers().subscribe({
      next: (response) => {
        const currentDate = new Date();
        this.eepUsers = response.filter(eep => {
          // Check if endDate is not null and is expired
          if (eep.endDate && new Date(eep.endDate) < currentDate) {
            // Move to eep-old, you might want to call a service or a method here
            this.moveToOldEep(eep); // Implement this method to handle the old EEP logic
            return false; // Filter out expired EEP
          }
          return true; // Keep active EEP
        });
      },
      error: (error) => {
        console.error('Error fetching EEP users:', error);
      }
    });
  }
  
  moveToOldEep(eep) {
    // Logic to move expired EEP to eep-old
    console.log('Moving expired EEP to old:', eep);
    // You can add logic here to call a service to add it to eep-old if necessary
  }
  
  

  editEepUser(email: string) {
    // Navigate to edit component or handle edit logic using email or any other identifier
    this.router.navigate(['/edit-eep', email]); // Update with the actual route to edit EEP using email
  }

  // Method to delete expired EEP users
  deleteExpiredEeps() {
    const currentDate = new Date();
    this.eepUsers = this.eepUsers.filter(eep => {
      if (eep.endDate && new Date(eep.endDate) < currentDate) {
        // If the endDate is expired, call the service to delete
        this.userService.deleteEepUser(eep.email).subscribe({
          next: () => console.log(`Deleted expired EEP user: ${eep.name}`),
          error: (error) => console.error('Error deleting EEP user:', error)
        });
        return false; // Filter out expired EEP
      }
      return true; // Keep active EEP
    });
  }
}
