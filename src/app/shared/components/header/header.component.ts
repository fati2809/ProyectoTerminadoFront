import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';
import { AuthService } from '../../../core/auth/auth.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [ButtonModule, RippleModule, MenubarModule, AvatarModule]
})
export class HeaderComponent {
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
  @Input() headerTitle: string = '';

  constructor( private authService: AuthService) { }

  logout(): void {
    this.authService.logout();
    console.log('Se hizo clic en Cerrar sesión');

  }

  addTask() {
    console.log('Add task clicked');
    // Implementa la lógica para agregar una tarea aquí
  }
}
