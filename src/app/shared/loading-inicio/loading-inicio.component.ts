import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-loading-inicio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './loading-inicio.component.html',
  styleUrls: ['./loading-inicio.component.css']
})
export class LoadingInicioComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
    setTimeout(() => {
      // Verifica que document y window existan antes de usarlos (seguro en móvil y SSR)
      if (typeof document !== 'undefined' && typeof window !== 'undefined') {
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
          loadingScreen.classList.add('fade-out');
        }

        // Detectar si el dispositivo es móvil
        const isMobile = window.innerWidth <= 768;

        // Redirigir según el tipo de dispositivo
        setTimeout(() => {
          if (isMobile) {
            this.router.navigate(['/login']);    // Redirige a login móvil
          } else {
            this.router.navigate(['/inicio']);   // Redirige a inicio escritorio
          }
        }, 1000); // tiempo para que termine la animación
      }
    }, 5000); // tiempo de espera inicial
  }
}
