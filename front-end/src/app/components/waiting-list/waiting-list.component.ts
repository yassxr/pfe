import { Component, OnInit } from '@angular/core';
import { DocumentService } from '../../service/document.service';
import { DocumentDto } from '../../models/document.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-waiting-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './waiting-list.component.html',
  styleUrls: ['./waiting-list.component.scss']
})
export class WaitingListComponent implements OnInit {
  documents: DocumentDto[] = [];  // Array to hold documents

  constructor(private documentService: DocumentService) {}

  ngOnInit(): void {
    this.loadPendingDocuments();
  }

  loadPendingDocuments(): void {
    this.documentService.getAllDocuments().subscribe({
        next: (documents) => {
            console.log('Fetched Documents:', documents); // Log the fetched documents
            this.documents = documents.filter(document => document.status === 'En attente');
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

  setStatus(documentId: number, status: string): void {
    this.documentService.updateStatus(documentId, status).subscribe({
      next: (response) => {
        console.log('Status updated:', response);
        
        // Check if the status is set to "Validé"
        if (status === 'Validé') {
          // Optionally handle any additional logic for validated documents here, 
          // such as showing a success message
        }
        
        this.loadPendingDocuments();  // Reload documents to reflect status change
      },
      error: (error) => {
        console.error('Error updating status:', error);
      }
    });
  }
}
