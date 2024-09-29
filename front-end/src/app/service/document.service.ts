// src/app/services/document.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DocumentDto } from '../models/document.model'; // Adjust the path as needed


@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private baseUrl: string = 'http://localhost:8005/api/documents'; // Update with your backend URL

  constructor(private http: HttpClient) {}

  getUserDocuments(userId: number): Observable<DocumentDto[]> {
    return this.http.get<DocumentDto[]>(`${this.baseUrl}/user/${userId}/documents`);
  }

  getAllDocuments(): Observable<DocumentDto[]> {
    return this.http.get<DocumentDto[]>(`${this.baseUrl}/all`); // Ensure this URL matches your backend endpoint
}
  updateStatus(documentId: number, status: string): Observable<Document> {
    return this.http.put<Document>(`${this.baseUrl}/${documentId}/status`, status);
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

getNonValidatedDocuments(): Observable<DocumentDto[]> {
  return this.http.get<DocumentDto[]>(`${this.baseUrl}/non-validated`);
}

getValidatedDocuments(): Observable<DocumentDto[]> {
  return this.http.get<DocumentDto[]>(`${this.baseUrl}/validated`);
}

invalidateDocument(documentId: number): Observable<any> {
  return this.http.put(`${this.baseUrl}/${documentId}/invalidate`, {});
}

deleteDocument(documentId: number): Observable<void> {
  return this.http.delete<void>(`${this.baseUrl}/delete/${documentId}`);
}


}
