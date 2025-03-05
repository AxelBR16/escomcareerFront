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
  isCarrerasRoute: boolean = false;
  isForgotRoute: boolean = false;
  isLoginRoute: boolean = false;

  showMenu: boolean = false;
  isLoggedIn: boolean = false;
  userRole: string | null = null;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isCarrerasRoute = this.router.url.includes('/carreras');
        this.isForgotRoute = this.router.url.includes('/forgot-password');
        this.isLoginRoute = this.router.url.includes('/login');
      }
    });

    this.authService.getLoggedInStatus().subscribe(status => {
      this.isLoggedIn = status;
    });

    this.authService.getUserRole().subscribe(role => {
      this.userRole = role;
    });
  }

  toggleMenu(): void {
    this.showMenu = !this.showMenu;
  }

  signOut() {
    this.authService.clearUserSession();
    this.router.navigate(['/login']);
  }
}


/* ya no sirve uwu
export class NavbarComponent implements OnInit {
  isCarrerasRoute: boolean = false;
  isForgotRoute: boolean = false;
  isLoginRoute: boolean = false;

  showMenu: boolean = false;
  isLoggedIn: boolean = false;

  constructor(private router: Router, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isCarrerasRoute = this.router.url.includes('/carreras');
        this.isForgotRoute = this.router.url.includes('/forgot-password');
        this.isLoginRoute = this.router.url.includes('/login');
      }
    });

    this.authService.getLoggedInStatus().subscribe(status => {
      this.isLoggedIn = status;
    });
  }


  // Alterna la visibilidad del menú en pantallas pequeñas
  toggleMenu(): void {
    this.showMenu = !this.showMenu;
  }

  signOut() {
    const accessToken = sessionStorage.getItem('token');
    if (accessToken) {
      this.authService.signOut(accessToken).subscribe(
        response => {
          console.log('Cierre de sesión exitoso', response);
          this.authService.clearUserSession(); // Llamar al método para cerrar sesión

          this.router.navigate(['/login']);  // Redirige a la página de login
        },
        error => {
          console.error('Error al cerrar sesión:', error);
        }
      );
    }
  }
}*/
