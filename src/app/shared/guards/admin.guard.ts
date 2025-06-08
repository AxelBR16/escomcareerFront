import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate,ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})

export class AdminGuard implements CanActivate {
  
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
      if (!isPlatformBrowser(this.platformId)) {
        return false;
      }

      const isLoggedIn = await this.authService.isLoggedIn();
      if (!isLoggedIn) {
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
      }

      const userRole = await this.authService.getCurrentUserRole();
      if (userRole !== 'ROLE_ADMIN') {
        return false;
      }

      return true;

    } catch (error) {
      console.error('❌ Error en AdminGuard:', error);
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url, error: 'auth-error' } });
      return false;
    }
  }
}