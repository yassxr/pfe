import { Component, OnInit } from '@angular/core';
import { DocumentService } from '../../service/document.service';
import { UserService } from '../../service/user.service';
import { DocumentDto } from '../../models/document.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserDto } from 'src/app/models/user.model';

@Component({
  selector: 'app-waiting-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './waiting-list.component.html',
  styleUrls: ['./waiting-list.component.scss']
})
export class WaitingListComponent implements OnInit {
  rejectionReason: string = ''; 
  documentIdToReject: number | null = null; 
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
      this.documentService.getAllPendingDocuments().subscribe(
        (data) => {
          this.documents = data;
        },
        (error) => {
          console.error('Error fetching pending documents:', error);
        }
      );
    } else if (this.selectedEmail) {
      const userId = this.getUserIdByEmail(this.selectedEmail);
      this.documentService.getPendingDocumentsByUserId(userId).subscribe(
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
        a.download = `document_${documentId}.pdf`; // Use document ID for filename
        a.click();
        window.URL.revokeObjectURL(url); // Clean up the URL after the download
      },
      error: (error) => {
        console.error('Error downloading document:', error);
      }
    });
  }

  setStatus(documentId: number, newStatus: string): void {
    if (newStatus === 'Non validé') {
      const rejectionReason = prompt("Veuillez entrer le motif de non-validation :");
      if (rejectionReason) {
        this.documentService.invalidateDocument(documentId, rejectionReason).subscribe({
          next: () => {
            console.log(`Document ${documentId} invalidated with reason: ${rejectionReason}`);
            this.loadDocuments(); // Reload documents to reflect the status change
          },
          error: (error) => {
            console.error('Error invalidating document:', error);
          }
        });
      } else {
        console.error('Le motif de rejet est requis.');
      }
    } else {
      const statusMap = { status: newStatus };
      this.documentService.updateDocumentStatus(documentId, statusMap).subscribe({
        next: (updatedDocument) => {
          const index = this.documents.findIndex(doc => doc.id === documentId);
          if (index !== -1) {
            this.documents[index] = updatedDocument; // Update the document in the local list
          }
          this.loadDocuments(); // Reload documents to reflect the status change
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour du statut :', error);
        }
      });
    }
  }
}
