import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EEP } from '../models/eep.model';

@Injectable({
  providedIn: 'root'
})
export class EepService {
  private baseUrl = 'http://localhost:8080/api/eep';

  constructor(private http: HttpClient) { }

  getAllEEPs(): Observable<EEP[]> {
    return this.http.get<EEP[]>(this.baseUrl);
  }

  createEEP(eep: EEP): Observable<EEP> {
    return this.http.post<EEP>(this.baseUrl, eep);
  }

  deleteEEP(idEep: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${idEep}`);
  }
}
