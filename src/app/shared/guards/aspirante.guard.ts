import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AspiranteGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  canActivate(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const role = sessionStorage.getItem('role');
      if (!this.authService.isLoggedIn() || role !== 'ROLE_ASPIRANTE') {
        this.router.navigate(['/login']);
        return false;
      }
    } else {
      return false;
    }
    return true;
  }
}
