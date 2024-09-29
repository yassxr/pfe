import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../service/auth.service'; // Adjust the path as necessary
import { DocumentService } from '../../service/document.service'; // Service to handle document uploads
import { Router } from '@angular/router';
import { DocumentDto } from '../../models/document.model'; // Import the Document model
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload-document',
  standalone: true,
  imports: [CommonModule], // Include CommonModule for ngFor and other directives
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.scss']
})
export class UploadDocumentComponent implements OnInit {
  uploadForm: FormGroup;
  selectedFile: File | null = null;
  errorMessage: string = '';
  successMessage: string = '';
  documents: DocumentDto[] = []; // Array to hold documents
  userId: number | undefined; // Declare userId

  constructor(
    private formBuilder: FormBuilder,
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
    this.uploadForm = this.formBuilder.group({
      file: [null]
    });

    // Retrieve user ID from AuthService
    this.userId = this.authService.userId; // Use the userId getter

    // Load user's documents
    if (this.userId) {
      this.loadUserDocuments(this.userId); // Pass user ID to load documents
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.uploadForm.patchValue({ file: this.selectedFile });
    }
  }

  openUploadDialog(): void {
    // Trigger the file input or show a modal for uploading documents
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf'; // Accept only PDF files
    fileInput.onchange = (event) => {
      const target = event.target as HTMLInputElement;
      if (target.files) {
        this.selectedFile = target.files[0];
        this.uploadDocument(); // Automatically call uploadDocument after selection
      }
    };
    fileInput.click(); // Simulate a click to open the file dialog
  }
  

  uploadDocument(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'No file selected for upload.';
      this.successMessage = '';
      return;
    }

    if (this.userId) {
      // Proceed with upload if the user is authenticated
      this.documentService.uploadDocument(this.selectedFile, this.userId).subscribe({
        next: (response) => {
          this.successMessage = 'Document uploaded successfully!';
          this.errorMessage = '';
          this.uploadForm.reset(); // Reset the form
          this.selectedFile = null; // Clear the selected file
          this.loadUserDocuments(this.userId); // Reload documents after upload
        },
        error: (error) => {
          this.errorMessage = 'Error uploading document: ' + error.message;
          this.successMessage = '';
        }
      });
    }
  }

  loadUserDocuments(userId: number): void {
    this.documentService.getUserDocuments(userId).subscribe({
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
          this.loadUserDocuments(this.userId!); // Reload documents after deletion
        },
        error: (error) => {
          this.errorMessage = 'Error deleting document: ' + error.message;
          console.error('Error deleting document:', error);
        }
      });
    }
  }
  
  
}
