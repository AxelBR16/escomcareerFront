
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
    
    console.log('🛡️ AspiranteGuard: Verificando acceso...');
    
    try {
      // Verificar si estamos en el navegador (para SSR)
      if (!isPlatformBrowser(this.platformId)) {
        console.log('⚠️ No está en el navegador, acceso denegado');
        return false;
      }

      // Verificar si el usuario está logueado
      const isLoggedIn = await this.authService.isLoggedIn();
      console.log(`🔍 Estado de login: ${isLoggedIn ? 'Autenticado' : 'No autenticado'}`);
      
      if (!isLoggedIn) {
        console.log('❌ Usuario no autenticado, redirigiendo a login');
        this.router.navigate(['/login'], { 
          queryParams: { returnUrl: state.url } 
        });
        return false;
      }

      // Obtener el rol del usuario
      const userRole = await this.authService.getCurrentUserRole();
      console.log(`👤 Rol del usuario: ${userRole}`);

      console.log('✅ Acceso autorizado para ROLE_ASPIRANTE');
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
