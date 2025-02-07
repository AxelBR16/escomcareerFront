import { CommonModule, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule, NgClass],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isAuthenticated = false;
  isCarrerasRoute: boolean = false;
  isForgotRoute: boolean = false;
  isLoginRoute: boolean = false;

  showMenu: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isCarrerasRoute = this.router.url.includes('/carreras');
        this.isForgotRoute = this.router.url.includes('/forgot-password');
        this.isLoginRoute = this.router.url.includes('/login');
      }
    });
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
      this.isAuthenticated = true;
    }
  }

  // Alterna la visibilidad del menú en pantallas pequeñas
  toggleMenu(): void {
    this.showMenu = !this.showMenu;
  }

  signOut() {
    const accessToken = localStorage.getItem('token');
    if (accessToken) {
      this.authService.signOut(accessToken).subscribe(
        response => {
          console.log('Cierre de sesión exitoso', response);
          localStorage.removeItem('token');  // Elimina el token del almacenamiento
          localStorage.removeItem('role');
          this.isAuthenticated = false;  // Actualiza el estado de autenticación
          this.router.navigate(['/login']);  // Redirige a la página de login
        },
        error => {
          console.error('Error al cerrar sesión:', error);
        }
      );
    }
  }
}
