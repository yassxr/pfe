// eep-old.component.ts
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-eep-old',
  templateUrl: './eep-old.component.html',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  styleUrls: ['./eep-old.component.scss']
})
export class EepOldComponent implements OnInit {
  oldEepList: any[] = []; // Store old EEP users

  constructor(private userService: UserService) {}

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

  editEep(email: string): void {
    // Logic for editing the EEP
    console.log('Edit EEP:', email);
  }

}
