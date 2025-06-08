import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-loading-inicio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './loading-inicio.component.html',
  styleUrls: ['./loading-inicio.component.css']
})
export class LoadingInicioComponent implements OnInit {

  isLoggedIn: boolean = false;
  userRole: string | null = null; // Permitir que userRole sea un string o null

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getLoggedInStatus().subscribe(status => {
      this.isLoggedIn = status;
    });

    // Assuming getUserRole() is a method in AuthService that fetches the user's role
    this.authService.getUserRole().subscribe(role => {
      this.userRole = role;
    });

    setTimeout(() => {
      if (typeof document !== 'undefined' && typeof window !== 'undefined') {
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
          loadingScreen.classList.add('fade-out');
        }

        // Detectar si el dispositivo es móvil
        const isMobile = window.innerWidth <= 768;

        // Condición para la redirección según el estado de login y el rol del usuario
        setTimeout(() => {
          if (this.isLoggedIn) {
            if (this.userRole === 'ROLE_ASPIRANTE') {
              this.router.navigate(['/aspirante-dashboard']); // Redirige al dashboard de aspirante
            } else if (this.userRole === 'ROLE_EGRESADO') {
              this.router.navigate(['/egresado-dashboard']); 
            } else if (this.userRole === 'ROLE_ADMIN') {
              this.router.navigate(['/admin-dashboard']); 
            } else {
              this.router.navigate(['/inicio']); // Redirige a la página de inicio para otros roles
            }
          } else {
            if (isMobile) {
              this.router.navigate(['/login']);    // Redirige a login móvil
            } else {
              this.router.navigate(['/inicio']);   // Redirige a inicio escritorio
            }
          }
        }, 1000); // tiempo para que termine la animación
      }
    }, 2000); // tiempo de espera inicial
  }
}
