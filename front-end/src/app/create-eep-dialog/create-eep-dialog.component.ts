import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-eep-dialog',
  templateUrl: './create-eep-dialog.component.html',
  styleUrls: ['./create-eep-dialog.component.scss']
})
export class CreateEEPDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<CreateEEPDialogComponent>) {}

  ngOnInit(): void {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onCreate(): void {
    // Ajoutez ici la logique pour créer un nouvel EEP
    this.dialogRef.close('created');
  }
}
