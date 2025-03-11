import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CargarScriptsService {
  constructor() {}

  Carga(scripts: string[]): void {
    scripts.forEach(script => {
      const scriptElement = document.createElement('script');
      scriptElement.src = script;
      scriptElement.type = 'text/javascript';
      scriptElement.async = true;
      document.body.appendChild(scriptElement);
    });
  }

}
