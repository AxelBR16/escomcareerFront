import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CargarScriptsService {

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  Carga(scripts: string[]): void {
    if (isPlatformBrowser(this.platformId)) {
      for (let script of scripts) {
        const node = this.document.createElement('script');
        node.src = script;
        const body = this.document.getElementsByTagName('body')[0];
        body.appendChild(node);
      }
    }
  }
}
