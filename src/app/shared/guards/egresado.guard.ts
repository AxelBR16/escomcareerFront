import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate,ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class EgresadoGuard implements CanActivate {
  
  constructor(
    private router: Router,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    
    console.log('🛡️ EgresadoGuard: Verificando acceso...');
    
    try {
      if (!isPlatformBrowser(this.platformId)) {
        return false;
      }

      const isLoggedIn = await this.authService.isLoggedIn();
      if (!isLoggedIn) {
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
      }

      const userRole = await this.authService.getCurrentUserRole();
      if (userRole !== 'ROLE_EGRESADO') {
        console.log(`❌ Acceso denegado para EgresadoGuard. Rol: ${userRole}`);
        return false;
      }

      console.log('✅ Acceso autorizado para ROLE_EGRESADO');
      return true;

    } catch (error) {
      console.error('❌ Error en EgresadoGuard:', error);
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url, error: 'auth-error' } });
      return false;
    }
  }
}