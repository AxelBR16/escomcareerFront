import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { Platform } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { SplashScreenComponent } from './shared/splash-screen/splash-screen.component';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, CommonModule, SplashScreenComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'escomcareer';
  showSplash: boolean = true;  // Controla la animación de carga
  isMobile: boolean = false;   // Verifica si es móvil

  constructor(private platform: Platform) {}

  ngOnInit() {
    // Detecta si la aplicación está corriendo en un dispositivo móvil
    this.isMobile = this.platform.is('mobile');

    // Solo mostrar la animación en la versión móvil
    if (this.isMobile) {
      setTimeout(() => {
        this.showSplash = false;
      }, 2000);
    } else {
      this.showSplash = false;
    }
  }
}
