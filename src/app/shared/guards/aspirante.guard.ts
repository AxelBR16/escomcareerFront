import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AspiranteGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}
  canActivate(): boolean {
    if (!this.authService.isLoggedIn() && !(sessionStorage.getItem('role') === 'ROLE_ASPIRANTE')) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
