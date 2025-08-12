import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private apiUrl = 'https://auth-service-or5z.onrender.com/auth';

  constructor(private http: HttpClient) {}

  getLogs(user?: string, route?: string, status?: string, startDate?: Date, endDate?: Date): Observable<any> {
    let params: { [key: string]: string } = {};
    if (user) params['user'] = user;
    if (route) params['route'] = route;
    if (status) params['status'] = status;
    if (startDate) params['start_date'] = startDate.toISOString().split('T')[0];
    if (endDate) params['end_date'] = endDate.toISOString().split('T')[0];

    return this.http.get<any>(`${this.apiUrl}/logs`, { params });
  }
}
