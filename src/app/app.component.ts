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
  imports: [RouterOutlet, CommonModule, NavbarComponent, FooterComponent, LoadingInicioComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'escomcareer';
  isLoading: boolean = true;
  isMobile: boolean = false; // Controla si el dispositivo es móvil
  showNavbarFooter: boolean = true; // Controla si se debe mostrar el Navbar y el Footer

  constructor(private router: Router, private deviceService: DeviceDetectorService) {}

  ngOnInit(): void {
    // Usar ngx-device-detector para verificar el dispositivo
    this.isMobile = this.deviceService.isMobile(); // Detectar si es móvil

    // Suscribirse a los cambios de ruta
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd) // Filtra solo los eventos de navegación
    ).subscribe((event: NavigationEnd) => {
      if (event.url === '/inicio-mobile') {
        // Si estamos en la ruta de inicio móvil, no mostrar Navbar y Footer
        this.showNavbarFooter = false;
      } else {
        // Mostrar Navbar y Footer en otras rutas
        this.showNavbarFooter = true;
      }
    });

    // Simular la carga y redirección después de 3 segundos
    setTimeout(() => {
      this.isLoading = false;
      if (this.isMobile) {
        this.router.navigate(['/inicio-mobile']); // Redirigir a la vista móvil
      } else {
        this.router.navigate(['/inicio']); // Redirigir a la vista de escritorio
      }
    }, 3000);
  }

  onLoadingFinished() {
    this.isLoading = false;
    if (this.isMobile) {
      this.router.navigate(['/inicio-mobile']);
    } else {
      this.router.navigate(['/inicio']);
    }
  }
}
