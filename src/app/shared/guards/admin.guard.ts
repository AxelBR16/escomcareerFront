import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}
  canActivate(): boolean {
    if (!this.authService.isLoggedIn() && !(sessionStorage.getItem('role') === 'ROLE_ADMIN')) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
