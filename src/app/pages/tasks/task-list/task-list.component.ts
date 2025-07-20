import { Component, OnInit } from '@angular/core';
import { TaskService } from '../tasks.service';
import { Task } from '../../../core/models/task.model';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { DragDropModule } from 'primeng/dragdrop';
import { HeaderComponent } from '../../../shared/components/header/header.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  imports: [CommonModule, PanelModule, CardModule, DragDropModule, HeaderComponent]
})
export class
TaskListComponent implements OnInit {
  tasks: Task[] = [];
  draggedTask: Task | null = null;
  kanbanColumns: any[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    let username: string | null = null;
    if (typeof window !== 'undefined') {
      username = localStorage.getItem('username');
    }
    if (username) {
      this.taskService.getTasksByUser(username).subscribe({
        next: (res) => {
          this.tasks = res.intData?.data ?? [];
          this.setKanbanColumns();
        },
        error: (err) => {
          this.tasks = [];
        }
      });
    }
  }

  // Guardar la tarea que se está arrastrando
  dragStart(task: Task) {
    this.draggedTask = task;
  }

  // Limpiar la tarea arrastrada al finalizar el arrastre
  dragEnd() {
    this.draggedTask = null;
  }

  // Manejar el evento de soltar la tarea en una columna
  drop(status: string) {
    if (this.draggedTask) {
      // Actualizar el estado de la tarea
      const updatedTask = { ...this.draggedTask, status };
      this.updateTaskStatus(updatedTask);
      // Actualizar las columnas del Kanban
      this.tasks = this.tasks.map(t => (t.id === updatedTask.id ? updatedTask : t));
      this.setKanbanColumns();
    }
  }

  // Método para actualizar el estado de la tarea en el backend
  updateTaskStatus(task: Task) {
    this.taskService.updateTask(task).subscribe({
      next: (res) => {
        console.log('Tarea actualizada:', res);
      },
      error: (err) => {
        console.error('Error al actualizar la tarea:', err);
      }
    });
  }

  setKanbanColumns() {
    this.kanbanColumns = [
      {
        header: 'Pendiente',
        status: 'incomplete',
        tasks: this.tasks.filter(t => t.status === 'incomplete')
      },
      {
        header: 'En progreso',
        status: 'inprogress',
        tasks: this.tasks.filter(t => t.status === 'inprogress')
      },
      {
        header: 'Pausada',
        status: 'paused',
        tasks: this.tasks.filter(t => t.status === 'paused')
      },
      {
        header: 'Revisión',
        status: 'revision',
        tasks: this.tasks.filter(t => t.status === 'revision')
      },
      {
        header: 'Hecho',
        status: 'done',
        tasks: this.tasks.filter(t => t.status === 'done')
      }
    ];
  }

  getCardColor(status: string): string {
    switch (status) {
      case 'done':
        return '#C8E6C9'; // Light green
      case 'paused':
        return '#FFF9C4'; // Light yellow
      case 'inprogress':
        return '#FFE0B2'; // Light orange
      case 'revision':
        return '#BBDEFB'; // Light blue
      case 'incomplete':
      default:
        return '#CFD8DC'; // Light gray
    }
  }

  getStatusTextColor(status: string): string {
    switch (status) {
      case 'done':
        return '#388E3C'; // Dark green
      case 'paused':
        return '#FBC02D'; // Dark yellow
      case 'inprogress':
        return '#F57C00'; // Dark orange
      case 'revision':
        return '#1976D2'; // Dark blue
      case 'incomplete':
      default:
        return '#455A64'; // Dark gray
    }
  }

  getColumnColor(status: string): string {
    switch (status) {
      case 'incomplete':
        return '#0288D1'; // Blue for Pendiente
      case 'inprogress':
        return '#F57C00'; // Orange for En progreso
      case 'paused':
        return '#FFCA28'; // Yellow for Pausada
      case 'revision':
        return '#1976D2'; // Dark blue for Revisión
      case 'done':
        return '#4CAF50'; // Green for Hecho
      default:
        return '#424242'; // Default dark gray
    }
  }
}
