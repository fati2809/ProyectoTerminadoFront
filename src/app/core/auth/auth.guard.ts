import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const publicRoutes = ['/auth/login', '/auth/register'].includes(route.routeConfig?.path || '');

    return this.authService.accessToken$.pipe(
      take(1), // Toma el valor actual y se desuscribe
      map(token => {
        if (token && !this.authService.isTokenExpired(token)) {
          // Token válido, permite acceso
          return true;
        } else if (publicRoutes) {
          // Ruta pública, permite acceso sin token
          return true;
        } else {
          console.log('AuthGuard: Token expirado o no válido, redirigiendo a /auth/login');
          return this.router.createUrlTree(['/auth/login']);
        }
      })
    );
  }
}
