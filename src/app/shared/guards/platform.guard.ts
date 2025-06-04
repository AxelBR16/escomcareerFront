import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Platform } from '@ionic/angular'; // Usar Platform si usas Ionic, si no puedes hacer tu propia lógica de detección

@Injectable({
  providedIn: 'root'
})
export class PlatformGuard implements CanActivate {

  constructor(private platform: Platform, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

    // Si estamos en un dispositivo móvil
    if (this.platform.is('mobile')) {
      this.router.navigate(['/inicio-mobile']);
      return false;
    }

    // Si estamos en la web
    if (this.platform.is('desktop')) {
      // Redirigir a la vista web
      this.router.navigate(['/inicio-web']);
      return false;  // Previene la navegación a la ruta original
    }

    return true;  // Permite la navegación a la ruta actual si no es móvil ni web
  }
}
