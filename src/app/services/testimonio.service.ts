import { Injectable } from '@angular/core';
import { Testimonio } from '../models/testimonio.model'; // Asegúrate de que el modelo esté importado

@Injectable({
  providedIn: 'root'
})
export class TestimonioService {

  private testimonios: Testimonio[] = [];

  // Método para agregar un testimonio
  agregarTestimonio(testimonio: Testimonio) {
    this.testimonios.push(testimonio);
    console.log("Testimonio agregado: ", testimonio);  // Puedes revisar esto en la consola para asegurarte de que se agrega
  }

  // Método para obtener todos los testimonios
  getTestimonios(): Testimonio[] {
    return this.testimonios;
  }
}
