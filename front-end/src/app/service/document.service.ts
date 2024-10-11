// src/app/services/document.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DocumentDto } from '../models/document.model'; // Adjust the path as needed
import { UserDto } from '../models/user.model'; // Adjust the path as needed


@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private baseUrl: string = 'http://localhost:8005/api/documents'; // Update with your backend URL

  constructor(private http: HttpClient) {}

  getUserDocuments(userId: number): Observable<DocumentDto[]> {
    return this.http.get<DocumentDto[]>(`${this.baseUrl}/user/${userId}`);
  }
  getUsers(): Observable<UserDto[]> { // Add this method to get users
    return this.http.get<UserDto[]>(`http://localhost:8005/users/`); // Adjust the URL as needed
  }
getAllDocuments(): Observable<DocumentDto[]> {
  return this.http.get<DocumentDto[]>(`${this.baseUrl}/all`); // Adjust according to your API
}


updateDocumentStatus(documentId: number, statusMap: { status: string }): Observable<DocumentDto> {
  return this.http.put<DocumentDto>(`${this.baseUrl}/${documentId}/status`, statusMap);
}

getPendingDocumentsByUserId(userId: number): Observable<DocumentDto[]> {
  return this.http.get<DocumentDto[]>(`${this.baseUrl}/${userId}/pending`);
}

  
    // Fetch all pending documents
getAllValidatedDocuments(): Observable<DocumentDto[]> {
      return this.http.get<DocumentDto[]>(`${this.baseUrl}/all/validated`); // Adjust according to your API if needed
    }

    getValidatedDocumentsByUserId(userId: number): Observable<DocumentDto[]> {
      return this.http.get<DocumentDto[]>(`${this.baseUrl}/${userId}/validated`);
    }
    
      
        // Fetch all pending documents
    getAllPendingDocuments(): Observable<DocumentDto[]> {
          return this.http.get<DocumentDto[]>(`${this.baseUrl}/all/pending`); // Adjust according to your API if needed
        }

        getAllNonValidatedDocuments(): Observable<DocumentDto[]> {
          return this.http.get<DocumentDto[]>(`${this.baseUrl}/all/non-validated`); // Adjust according to your API if needed
        }
    
        getNonValidatedDocumentsByUserId(userId: number): Observable<DocumentDto[]> {
          return this.http.get<DocumentDto[]>(`${this.baseUrl}/${userId}/non-validated`);
        }

  uploadDocument(file: File, userId: number): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId.toString());
    

    return this.http.post(`${this.baseUrl}/upload`, formData);
  }

  downloadDocument(documentId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/download/${documentId}`, { responseType: 'blob' });
  }

  // src/app/services/document.service.ts



invalidateDocument(documentId: number, rejectionReason: string): Observable<void> {
  return this.http.put<void>(`${this.baseUrl}/${documentId}/invalidate`, { rejectionReason });
}

deleteDocument(documentId: number): Observable<void> {
  return this.http.delete<void>(`${this.baseUrl}/delete/${documentId}`);
}


}
