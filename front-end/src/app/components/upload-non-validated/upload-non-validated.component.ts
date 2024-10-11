import { Component, OnInit } from '@angular/core';
import { DocumentService } from '../../service/document.service'; // Adjust the path as necessary
import { DocumentDto } from '../../models/document.model'; // Adjust the path as necessary
import { AuthService } from '../../service/auth.service'; // Adjust the path as necessary
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload-validated',
  standalone: true,
  imports: [CommonModule], // Include CommonModule for ngFor and other directives
  templateUrl: './upload-non-validated.component.html',
  styleUrl: './upload-non-validated.component.scss'
})

  export class UploadNonValidatedComponent implements OnInit {
    documents: DocumentDto[] = [];
    selectedFile: File | null = null;
    errorMessage: string = '';
    successMessage: string = '';
    userId: number | undefined; // Declare userId
  
    constructor(
      private authService: AuthService,
      private documentService: DocumentService,
      private router: Router
    ) {
      // Check if user is authenticated, redirect if not
      if (!this.authService.currentUserValue) {
        this.router.navigate(['/guest/login']); // Redirect to login if user is not authenticated
      }
    }
  
    ngOnInit(): void {

        this.userId = this.authService.userId; // Use the userId getter
  
      // Load user's documents
      if (this.userId) {
        this.loadNonValidatedDocuments(this.userId); // Pass user ID to load documents
      }
    }
  
    loadNonValidatedDocuments(userId: number): void {
      this.documentService.getNonValidatedDocumentsByUserId(userId).subscribe({
        next: (documents) => {
          this.documents = documents; // Update the documents array
        },
        error: (error) => {
          console.error('Error fetching documents:', error);
        }
      });
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
      if (confirm('Are you sure you want to delete this document?')) {
        this.documentService.deleteDocument(documentId).subscribe({
          next: () => {
            this.successMessage = 'Document deleted successfully!';
            this.loadNonValidatedDocuments(this.userId!); // Reload documents after deletion
          },
          error: (error) => {
            this.errorMessage = 'Error deleting document: ' + error.message;
            console.error('Error deleting document:', error);
          }
        });
      }
    }
    
    
}
