import { Component, OnInit } from '@angular/core';
import { TaskService } from '../tasks.service';
import { Task } from '../../../core/models/task.model';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-task-list',
  standalone: true,
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  imports: [CommonModule, PanelModule, CardModule, MenubarModule, AvatarModule]
})
export class
TaskListComponent implements OnInit {
  tasks: Task[] = [];
  items: MenuItem[] = [
    {
      label: 'Inicio',
      icon: 'pi pi-home',
      badge: '2'
    },
    {
      label: 'Configuración',
      icon: 'pi pi-cog',
      items: [
        { label: 'Perfil', icon: 'pi pi-user' },
        { label: 'Privacidad', icon: 'pi pi-lock', shortcut: 'Ctrl+P' }
      ]
    },
    {
      label: 'Salir',
      icon: 'pi pi-sign-out',
      badge: 'NEW'
    }
  ];
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
