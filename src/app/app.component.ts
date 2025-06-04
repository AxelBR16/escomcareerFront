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
  showSplash: boolean = true;
   isMobile: boolean = false;
    isPlatformReady: boolean = false;

  constructor(private platform: Platform) {}

 ngOnInit() {
    // Espera a que la plataforma esté completamente cargada antes de hacer algo
    this.platform.ready().then(() => {
      this.isPlatformReady = true;  // Marca la plataforma como lista
      this.isMobile = this.platform.is('mobile');
      if (this.isMobile) {
        // Si es móvil, mostrar splash por 2 segundos
        setTimeout(() => {
          this.showSplash = false;
        }, 2000);
      } else {
        this.showSplash = false;  // No es necesario mostrar splash en plataformas web
      }
    });
  }

  // Se asegura de que el contenido solo se muestre cuando la plataforma esté lista
  shouldShowContent(): boolean {
    return this.isPlatformReady && !this.showSplash;
  }
 }
