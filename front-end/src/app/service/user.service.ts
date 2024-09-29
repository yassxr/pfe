import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8005/users'; // Adjust based on your backend URL

  constructor(private http: HttpClient) {}

  createEepUser(name: string, email: string, sigle: string, raison: string): Observable<any> {
    const payload = { name, email, sigle, raison }; // Include raison in the payload
    return this.http.post(`${this.baseUrl}/create-eep`, payload);
  }

  getActiveEepUsers(): Observable<{
      name: string;
      email: string;
      sigle: string;
      raison: string;
      creationDate: Date;
      endDate: Date | null;
  }[]> {
      return this.http.get<{
          name: string;
          email: string;
          sigle: string;
          raison: string;
          creationDate: Date;
          endDate: Date | null;
      }[]>(`${this.baseUrl}/active-eep`);
  }

  deleteEepUser(email: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete-eep/${email}`); // Adjust as needed
  }

  updateEepUser(email: string, eepData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update-eep/${email}`, eepData);
  }

  getEepByEmail(email: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/get-eep/${email}`); // Ensure this matches your backend endpoint
  }

    // Add the getOldEepUsers method
    getOldEepUsers(): Observable<any[]> {
      return this.http.get<any[]>(`${this.baseUrl}/old-users`); // Adjust the endpoint as needed
    }

}

