import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';
import { AuthService } from '../../../core/auth/auth.service';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [ButtonModule, RippleModule, MenubarModule, AvatarModule, CommonModule, ToastModule],
  providers: [MessageService]
})
export class HeaderComponent {
  items: MenuItem[] = [
    {
      label: 'Inicio',
      icon: 'pi pi-home',
      badge: '2',
      command: () => this.router.navigate(['/tasks/task-list'])
    },
    {
      label: 'Tareas',
      command: () => this.router.navigate(['/tasks/task-list'])
    },
    {
      label: 'DashLogs',
      command: () => this.router.navigate(['/dashlogs'])
    },
    {
      label: 'Cerrar Sesión',
      icon: 'pi pi-sign-out',
      badge: 'NEW',
      command: () => this.logout() // Asocia el evento de clic con el método logout
    }
  ];
  @Input() headerTitle: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService // Inyecta MessageService
  ) {}

  logout(): void {
    this.authService.logout(); // Limpia los tokens y otros datos de autenticación
    console.log('Se hizo clic en Cerrar sesión');
    this.messageService.add({ // Muestra el mensaje de éxito
      severity: 'success',
      summary: 'Éxito',
      detail: 'Se cerró la sesión exitosamente',
      life: 7000 // Duración del mensaje en milisegundos
    });
    setTimeout(() => {
      this.router.navigate(['/auth/login']); // Redirige después de mostrar el mensaje
    }, 1000); // Espera 1 segundo para que el usuario vea el mensaje
  }
}
