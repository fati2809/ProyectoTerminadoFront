import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, RespuestaTareas } from '../../core/models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://158.69.197.251:5000/task';

  constructor(private http: HttpClient) {}

  getTasksByUser(createdBy: string): Observable<RespuestaTareas> {
    return this.http.get<RespuestaTareas>(`${this.apiUrl}/tasks/user/${createdBy}`);
  }

  updateTask(task: Task): Observable<any> {
    return this.http.put(`${this.apiUrl}/tasks/${task._id}`, task);
  }

  registerTask(task: Task): Observable<any> {
    return this.http.post(`${this.apiUrl}/register_task`, task);
  }

  deleteTask(taskId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/tasks/${taskId}`);
  }
}


