import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../service/user.service'; // Adjust the import based on your structure
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-eep',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-eep.component.html',
  styleUrls: ['./create-eep.component.scss']
})
export class CreateEepComponent {
  createEepForm: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.createEepForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      sigle: ['', Validators.required],
      raison: ['', Validators.required], // Add the raison field

    });
  }

  onSubmit() {
    if (this.createEepForm.valid) {
      const { name, email, sigle, raison } = this.createEepForm.value;

      this.userService.createEepUser(name, email, sigle, raison).subscribe({
        next: (response) => {
          console.log('EEP User created:', response);
          // Reset the form or perform any other action as needed
          this.createEepForm.reset();
        },
        error: (error) => {
          console.error('Error creating EEP User:', error);
          // Handle error as needed
        }
      });
    }
  }
}
