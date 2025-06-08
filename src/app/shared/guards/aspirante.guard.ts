
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AspiranteGuard implements CanActivate {
  
  constructor(
    private router: Router,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    
    
    try {
      // Verificar si estamos en el navegador (para SSR)
      if (!isPlatformBrowser(this.platformId)) {
        return false;
      }

      // Verificar si el usuario está logueado
      const isLoggedIn = await this.authService.isLoggedIn();
      
      if (!isLoggedIn) {
        this.router.navigate(['/login'], { 
          queryParams: { returnUrl: state.url } 
        });
        return false;
      }

      // Obtener el rol del usuario
      const userRole = await this.authService.getCurrentUserRole();

      return true;

    } catch (error) {
      console.error('❌ Error en AspiranteGuard:', error);
      
      // En caso de error, redirigir a login por seguridad
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: state.url, error: 'auth-error' } 
      });
      return false;
    }
  }
}
