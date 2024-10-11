// src/app/components/validated-list/validated-list.component.ts
import { Component, OnInit } from '@angular/core';
import { DocumentService } from '../../service/document.service';
import { DocumentDto } from '../../models/document.model';
import { CommonModule } from '@angular/common';
import { UserDto } from 'src/app/models/user.model';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-validated-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './validated-list.component.html',
  styleUrls: ['./validated-list.component.scss']
})
export class ValidatedListComponent implements OnInit {
  documents: DocumentDto[] = []; 
  selectedEmail: string | null = null;
  userEmails: UserDto[] = [];

  constructor(private documentService: DocumentService, private userService: UserService) {}

  ngOnInit(): void {
    this.loadUserEmails();
    this.selectedEmail = 'all'; // Set the default selection to 'all'
    this.loadDocuments(); // Load documents for all users on init
  }

  loadUserEmails(): void {
    this.userService.getAllUserEmails().subscribe(
      (data: any[] | null) => {
        console.log('API Response:', data); // Log the response to check the structure
  
        // Check if the data is valid
        if (data && Array.isArray(data)) {
          // Filter users who have the 'EEP' role
          this.userEmails = data.filter(user => 
            user.roles && user.roles.includes('EEP')
          );
        } else {
          // Handle case where data is null or not an array
          this.userEmails = [];
          console.error('No user data available or data is not an array');
        }
      },
      (error) => {
        console.error('Error fetching user emails:', error);
      }
    );
  }

  loadDocuments(): void {
    if (this.selectedEmail === 'all') {
      this.documentService.getAllValidatedDocuments().subscribe(
        (data) => {
          this.documents = data;
        },
        (error) => {
          console.error('Error fetching pending documents:', error);
        }
      );
    } else if (this.selectedEmail) {
      const userId = this.getUserIdByEmail(this.selectedEmail);
      this.documentService.getValidatedDocumentsByUserId(userId).subscribe(
        (data) => {
          this.documents = data;
        },
        (error) => {
          console.error('Error fetching documents:', error);
        }
      );
    }
  }

  onEmailChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedEmail = selectElement.value;
    this.loadDocuments();
  }

  private getUserIdByEmail(email: string): number {
    const user = this.userEmails.find(user => user.email === email);
    return user ? user.id : null;
  }


  downloadDocument(documentId: number): void {
    this.documentService.downloadDocument(documentId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.pdf'; // You can set the filename dynamically based on the document name
        a.click();
        window.URL.revokeObjectURL(url); // Clean up the URL after the download
      },
      error: (error) => {
        console.error('Error downloading document:', error);
      }
    });
  }

  deleteDocument(documentId: number): void {
    // Call the service method to delete the document
    this.documentService.deleteDocument(documentId).subscribe({
      next: () => {
        // Remove the document from the local list after successful deletion
        this.documents = this.documents.filter(doc => doc.id !== documentId);
      },
      error: (error) => {
        console.error('Error deleting document:', error);
      }
    });
  }
}
