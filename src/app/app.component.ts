import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet , NavigationEnd } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { Platform } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { LoadingInicioComponent } from './shared/loading-inicio/loading-inicio.component';
import { filter } from 'rxjs/operators';
import { DeviceDetectorService } from 'ngx-device-detector'; // Importamos el servicio de detección



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'escomcareer';
   showNavbarAndFooter = true; // Variable para controlar la visibilidad

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Observar los cambios de la ruta activa
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Ocultar navbar y footer solo si la ruta es la raíz ''
      const currentRoute = this.router.url;
      this.showNavbarAndFooter = currentRoute !== '/';
    });

     this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Detectar si el dispositivo es móvil
      const isMobile = window.innerWidth <= 768;  // Definir el umbral de dispositivos móviles

      // Ocultar navbar y footer si es un dispositivo móvil
      if (isMobile) {
        this.showNavbarAndFooter = false;
      } else {
        this.showNavbarAndFooter = true;
      }
    });
  }
}
