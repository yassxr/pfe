// src/app/components/non-validated-list/non-validated-list.component.ts
import { Component, OnInit } from '@angular/core';
import { DocumentService } from '../../service/document.service';
import { DocumentDto } from '../../models/document.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-non-validated-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './non-validated-list.component.html',
  styleUrls: ['./non-validated-list.component.scss']
})
export class NonValidatedListComponent implements OnInit {
  documents: DocumentDto[] = [];

  constructor(private documentService: DocumentService) {}

  ngOnInit(): void {
    this.loadNonValidatedDocuments();
  }

  loadNonValidatedDocuments(): void {
    this.documentService.getNonValidatedDocuments().subscribe((documents) => {
      this.documents = documents;
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
