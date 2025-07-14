import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/user.model';
import { RespuestaAutenticacion } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // archivo enviroments.ts
  private apiUrl = 'http://localhost:5000/auth';

  constructor(private http: HttpClient) {}

  register(userData: Usuario): Observable<RespuestaAutenticacion> {
    return this.http.post<RespuestaAutenticacion>(`${this.apiUrl}/register_user`, userData);
  }

  login(credentials: Usuario): Observable<RespuestaAutenticacion> {
    return this.http.post<RespuestaAutenticacion>(`${this.apiUrl}/login`, credentials);
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
