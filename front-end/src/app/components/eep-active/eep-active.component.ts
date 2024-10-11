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
    this.fetchEepUsers(); // Call the method to fetch EEP users when the component initializes
  }

  fetchEepUsers() {
    this.userService.getActiveEepUsers().subscribe({
      next: (response) => {
        const currentDate = new Date();
        
        // Log the fetched response for debugging
        console.log('Fetched EEP users:', response);
        
        this.eepUsers = response.filter(eep => {
          // Log the EEP being checked
          console.log('Checking EEP:', eep);
          
          // Check if endDate is not null and is expired
          if (eep.endDate) {
            const eepEndDate = new Date(eep.endDate);
            if (eepEndDate < currentDate) {
              // Move to eep-old if necessary
              this.moveToOldEep(eep); // Implement this method if you want to track old EEPs
              return false; // Filter out expired EEP
            }
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
    // Logic to move expired EEP to eep-old if necessary
    console.log('Moving expired EEP to old:', eep);
    // Add logic here to call a service to add it to eep-old if necessary
  }

  editEepUser(email: string) {
    // Navigate to the edit component and subscribe to the result
    this.router.navigate(['/edit-eep', email]).then(() => {
      // Refresh the list of EEP users after navigating back
      this.fetchEepUsers(); // Call the method to refresh the user list
    });
  }

  // Method to delete expired EEP users
  deleteExpiredEeps() {
    const currentDate = new Date();
    this.eepUsers.forEach(eep => {
      if (eep.endDate && new Date(eep.endDate) < currentDate) {
        // If the endDate is expired, call the service to delete
        this.userService.deleteEepUser(eep.email).subscribe({
          next: () => console.log(`Deleted expired EEP user: ${eep.name}`),
          error: (error) => console.error('Error deleting EEP user:', error)
        });
      }
    });

    // Now filter out expired users from the displayed list
    this.eepUsers = this.eepUsers.filter(eep => !eep.endDate || new Date(eep.endDate) >= currentDate);
  }
}
