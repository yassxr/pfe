import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-eep',
  standalone: true,
  templateUrl: './edit-eep.component.html',
  imports: [CommonModule, ReactiveFormsModule], // Import necessary modules here
  styleUrls: ['./edit-eep.component.scss']
})
export class EditEepComponent implements OnInit {
  eepForm: FormGroup;
  email: string; // To hold the email of the EEP being edited

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router
  ) {
    // Initialize the form
    this.eepForm = this.fb.group({
      name: ['', Validators.required],
      sigle: ['', Validators.required],
      raison: ['', Validators.required],
      endDate: [''] // Optional, can be null
    });
  }

  ngOnInit() {
    this.email = this.route.snapshot.paramMap.get('email')!;
    this.fetchEepDetails();
  }

  fetchEepDetails() {
    // Fetch EEP details by email
    this.userService.getEepByEmail(this.email).subscribe({
      next: (data) => {
        this.eepForm.patchValue(data); // Populate the form with existing data
      },
      error: (error) => {
        console.error('Error fetching EEP details:', error);
      }
    });
  }

  onSubmit() {
    if (this.eepForm.valid) {
      this.userService.updateEepUser(this.email, this.eepForm.value).subscribe({
        next: () => {
          alert('EEP details updated successfully!');
          this.router.navigate(['/eep-active']); // Navigate back to active EEPs
        },
        error: (error) => {
          console.error('Error updating EEP:', error);
        }
      });
    }
  }
}
