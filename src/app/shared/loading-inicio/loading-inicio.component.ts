import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-loading-inicio',
  imports: [CommonModule, RouterModule],
  templateUrl: './loading-inicio.component.html',
  styleUrl: './loading-inicio.component.css'
})
export class LoadingInicioComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    setTimeout(() => {
      // Obtener el elemento de la pantalla de carga y añadir la clase fade-out
      const loadingScreen = document.querySelector('.loading-screen');
      if (loadingScreen) {
        loadingScreen.classList.add('fade-out');
      }

      // Detectar si el dispositivo es móvil
      const isMobile = window.innerWidth <= 768;  // Definir el umbral de dispositivos móviles

      // Redirigir a la página correspondiente después de la animación de desvanecimiento (1 segundo)
      setTimeout(() => {
        if (isMobile) {
          this.router.navigate(['/inicio-mobile']);  // Redirige a la página de inicio móvil
        } else {
          this.router.navigate(['/inicio']);  // Redirige a la página de inicio de escritorio
        }
      }, 1000);  // Esperar el tiempo de duración de la animación (1 segundo)
    }, 5000);  // Espera 5 segundos antes de iniciar el desvanecimiento
  }
}