import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MobileGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const isMobile = window.innerWidth <= 768;  // Definir el umbral de dispositivos móviles

    // Si es un dispositivo móvil, redirigir y evitar el acceso a la ruta
    if (isMobile) {
      // Aquí, puedes devolver `false` para evitar que se active la ruta
      return true;  // Solo devuelve `true` si no bloqueas el acceso
    } else {
      // Si es un dispositivo no móvil, redirige a otra página o lo que sea necesario
      return true;
    }
  }
}
