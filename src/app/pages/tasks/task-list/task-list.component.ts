import { Component, OnInit } from '@angular/core';
import { TaskService } from '../tasks.service';
import { Task } from '../../../core/models/task.model';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { DragDropModule } from 'primeng/dragdrop';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-task-list',
  standalone: true,
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  imports: [
    CommonModule,
    PanelModule,
    CardModule,
    DragDropModule,
    HeaderComponent,
    DialogModule,
    InputTextModule,
    TextareaModule,
    CalendarModule,
    DropdownModule,
    ButtonModule,
    FormsModule,
    InputSwitchModule,
    ConfirmDialogModule
  ],
  providers: [ConfirmationService]
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  draggedTask: Task | null = null;
  kanbanColumns: any[] = [];
  displayDialog: boolean = false;
  editMode: boolean = false;
  rateLimitMessage: string | null = null;
  newTask: Task = {
    _id: undefined,
    name: '',
    description: '',
    created_at: new Date().toISOString().split('T')[0],
    created_by: '',
    dead_line: '',
    status: 'incomplete',
    is_alive: true
  };
  statusOptions: any[] = [
    { label: 'Pendiente', value: 'incomplete' },
    { label: 'En progreso', value: 'inprogress' },
    { label: 'Pausada', value: 'paused' },
    { label: 'Revisión', value: 'revision' },
    { label: 'Hecho', value: 'done' }
  ];

  constructor(private taskService: TaskService, private confirmationService: ConfirmationService) {
    if (!this.confirmationService) {
      console.error('ConfirmationService no está inyectado correctamente');
    }
  }

  ngOnInit(): void {
    let username: string | null = null;
    if (typeof window !== 'undefined') {
      username = localStorage.getItem('username');
    }
    if (username) {
      this.newTask.created_by = username;
      this.taskService.getTasksByUser(username).subscribe({
        next: (res) => {
          this.tasks = res.intData?.data ?? [];
          this.setKanbanColumns();
          this.rateLimitMessage = null;
        },
        error: (err) => {
          console.error('Error al obtener tareas:', err);
          this.tasks = [];
          if (err.status === 429) {
            this.rateLimitMessage = err.error.message || 'Has alcanzado el límite de peticiones. Por favor, intenta de nuevo más tarde.';
          } else {
            this.rateLimitMessage = 'Ocurrió un error al cargar las tareas. Por favor, intenta de nuevo.';
          }
        }
      });
    }
  }

  dragStart(task: Task) {
    this.draggedTask = task;
  }

  dragEnd() {
    this.draggedTask = null;
  }

  drop(status: string) {
    if (this.draggedTask) {
      const updatedTask = { ...this.draggedTask, status };
      this.updateTaskStatus(updatedTask);
      this.tasks = this.tasks.map(t => (t._id === updatedTask._id ? updatedTask : t));
      this.setKanbanColumns();
    }
  }

  updateTaskStatus(task: Task) {
    this.taskService.updateTask(task).subscribe({
      next: (res) => {
        console.log('Tarea actualizada:', res);
        this.rateLimitMessage = null;
      },
      error: (err) => {
        console.error('Error al actualizar la tarea:', err);
        if (err.status === 429) {
          this.rateLimitMessage = err.error.message || 'Has alcanzado el límite de peticiones. Por favor, intenta de nuevo más tarde.';
        } else {
          this.rateLimitMessage = 'Ocurrió un error al actualizar la tarea. Por favor, intenta de nuevo.';
        }
      }
    });
  }

  confirmDelete(taskId: string) {
    this.confirmationService.confirm({
      key: 'confirmDelete',
      message: '¿Estás seguro de que deseas eliminar esta tarea?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.deleteTask(taskId);
      }
    });
  }

  deleteTask(taskId: string) {
    this.taskService.deleteTask(taskId).subscribe({
      next: (res) => {
        console.log('Tarea eliminada:', res);
        this.tasks = this.tasks.filter(t => String(t._id) !== String(taskId));
        this.setKanbanColumns();
        this.rateLimitMessage = null;
      },
      error: (err) => {
        console.error('Error al eliminar la tarea:', err);
        if (err.status === 429) {
          this.rateLimitMessage = err.error.message || 'Has alcanzado el límite de peticiones. Por favor, intenta de nuevo más tarde.';
        } else {
          this.rateLimitMessage = 'Ocurrió un error al eliminar la tarea. Por favor, intenta de nuevo.';
        }
      }
    });
  }

  showAddTaskDialog() {
    this.editMode = false;
    this.newTask = {
      _id: undefined,
      name: '',
      description: '',
      created_at: new Date().toISOString().split('T')[0],
      created_by: localStorage.getItem('username') || '',
      dead_line: '',
      status: 'incomplete',
      is_alive: true
    };
    this.displayDialog = true;
    this.rateLimitMessage = null;
  }

  editTask(task: Task) {
    this.editMode = true;
    this.newTask = { ...task };
    this.displayDialog = true;
    this.rateLimitMessage = null;
  }

  private formatDate(date: any): string {
    if (!date) return '';
    if (typeof date === 'string') return date.slice(0, 10);
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  }

  saveTask() {
    if (!this.newTask.name?.trim() || !this.newTask.description?.trim() || !this.newTask.dead_line) {
      this.rateLimitMessage = 'Faltan campos requeridos: nombre, descripción o fecha límite.';
      return;
    }

    // Formatear fechas
    this.newTask.dead_line = this.formatDate(this.newTask.dead_line);
    this.newTask.created_at = this.formatDate(this.newTask.created_at);

    // Preparar objeto limpio
    const taskToSend: Task = {
      ...this.newTask,
      name: this.newTask.name.trim(),
      description: this.newTask.description.trim(),
      created_by: (this.newTask.created_by || '').trim(),
      status: this.newTask.status || 'incomplete',
      is_alive: this.newTask.is_alive !== undefined ? this.newTask.is_alive : true
    };

    if (this.editMode) {
      this.taskService.updateTask(taskToSend).subscribe({
        next: (res) => {
          console.log('Tarea editada:', res);
          this.taskService.getTasksByUser(taskToSend.created_by).subscribe({
            next: (res) => {
              this.tasks = res.intData?.data ?? [];
              this.setKanbanColumns();
              this.displayDialog = false;
              this.editMode = false;
              this.rateLimitMessage = null;
            },
            error: (err) => {
              console.error('Error al actualizar la lista de tareas:', err);
              this.rateLimitMessage = err.status === 429
                ? err.error.message || 'Has alcanzado el límite de peticiones. Intenta más tarde.'
                : 'Error al actualizar la lista de tareas. Intenta de nuevo.';
            }
          });
        },
        error: (err) => {
          console.error('Error al editar la tarea:', err);
          this.rateLimitMessage = err.status === 429
            ? err.error.message || 'Has alcanzado el límite de peticiones. Intenta más tarde.'
            : 'Error al editar la tarea. Intenta de nuevo.';
        }
      });
    } else {
      this.taskService.registerTask(taskToSend).subscribe({
        next: (res) => {
          console.log('Tarea registrada:', res);
          this.taskService.getTasksByUser(taskToSend.created_by).subscribe({
            next: (res) => {
              this.tasks = res.intData?.data ?? [];
              this.setKanbanColumns();
              this.displayDialog = false;
              this.rateLimitMessage = null;
            },
            error: (err) => {
              console.error('Error al actualizar la lista de tareas:', err);
              this.rateLimitMessage = err.status === 429
                ? err.error.message || 'Has alcanzado el límite de peticiones. Intenta más tarde.'
                : 'Error al actualizar la lista de tareas. Intenta de nuevo.';
            }
          });
        },
        error: (err) => {
          console.error('Error al registrar la tarea:', err);
          this.rateLimitMessage = err.status === 429
            ? err.error.message || 'Has alcanzado el límite de peticiones. Intenta más tarde.'
            : 'Error al registrar la tarea. Intenta de nuevo.';
        }
      });
    }
  }

  cancelTask() {
    this.displayDialog = false;
    this.editMode = false;
    this.rateLimitMessage = null;
  }

  clearRateLimitMessage() {
    this.rateLimitMessage = null;
  }

  setKanbanColumns() {
    this.kanbanColumns = [
      { header: 'Pendiente', status: 'incomplete', tasks: this.tasks.filter(t => t.status === 'incomplete') },
      { header: 'En progreso', status: 'inprogress', tasks: this.tasks.filter(t => t.status === 'inprogress') },
      { header: 'Pausada', status: 'paused', tasks: this.tasks.filter(t => t.status === 'paused') },
      { header: 'Revisión', status: 'revision', tasks: this.tasks.filter(t => t.status === 'revision') },
      { header: 'Hecho', status: 'done', tasks: this.tasks.filter(t => t.status === 'done') }
    ];
  }

  getCardColor(status: string): string {
    switch (status) {
      case 'done': return '#C8E6C9';
      case 'paused': return '#FFF9C4';
      case 'inprogress': return '#FFE0B2';
      case 'revision': return '#BBDEFB';
      case 'incomplete': default: return '#CFD8DC';
    }
  }

  getStatusTextColor(status: string): string {
    switch (status) {
      case 'done': return '#388E3C';
      case 'paused': return '#FBC02D';
      case 'inprogress': return '#F57C00';
      case 'revision': return '#1976D2';
      case 'incomplete': default: return '#455A64';
    }
  }

  getColumnColor(status: string): string {
  switch(status) {
    case 'incomplete': return '#0288D1';  // azul
    case 'inprogress': return '#F57C00';  // naranja
    case 'paused': return '#FFCA28';      // amarillo
    case 'revision': return '#1976D2';    // azul oscuro
    case 'done': return '#4CAF50';        // verde
    default: return '#424242';             // gris oscuro
  }
}

}
