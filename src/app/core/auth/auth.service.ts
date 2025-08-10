import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Usuario, RespuestaAutenticacion } from '../models/user.model';

interface JwtPayload {
  exp: number;
  user_id: string;
  username: string;
  // Otros campos del payload según tu backend
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://158.69.197.251:5000/auth';
  private accessTokenSubject = new BehaviorSubject<string | null>(this.getToken());
  public accessToken$ = this.accessTokenSubject.asObservable();

  constructor(private http: HttpClient) {
    // Verifica el token al iniciar el servicio
    this.checkTokenValidity();
  }

  register(userData: Usuario & { status: string }): Observable<RespuestaAutenticacion> {
    return this.http.post<RespuestaAutenticacion>(`${this.apiUrl}/register_user`, userData);
  }

  login(credentials: Usuario & { otp: string }): Observable<RespuestaAutenticacion> {
    return this.http.post<RespuestaAutenticacion>(`${this.apiUrl}/login`, credentials);
  }

  setToken(token: string) {
    localStorage.setItem('access_token', token); // Cambia a access_token para claridad
    this.accessTokenSubject.next(token);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    this.accessTokenSubject.next(null);
  }

  // Decodificación manual del token JWT
  private decodeToken(token: string): JwtPayload | null {
    try {
      const payloadBase64 = token.split('.')[1]; // Extrae el payload
      const decodedPayload = atob(payloadBase64); // Decodifica Base64
      return JSON.parse(decodedPayload); // Parsea el JSON
    } catch (e) {
      console.error('Error decodificando token:', e);
      return null;
    }
  }

  isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) {
      return true; // Si no se puede decodificar o no hay exp, considerarlo expirado
    }
    const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
    return decoded.exp < currentTime;
  }

  checkTokenValidity() {
    const token = this.getToken();
    if (token && this.isTokenExpired(token)) {
      this.logout(); // Expira la sesión si el token está vencido
    }
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }
}
