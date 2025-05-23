import { Component } from '@angular/core';
import { TestimonioService } from '../../services/testimonio.service'; // Asegúrate de que el servicio esté importado
import { Testimonio } from '../../models/testimonio.model';  // Importa el modelo Testimonio
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-experence',
  imports: [FormsModule, CommonModule ],
  templateUrl: './experence.component.html',
  styleUrls: ['./experence.component.css'],
 
})

export class ExperenceComponent {

  nombre: string = '';
  carrera: string = '';
  experiencia: string = '';
  trabajaRelacionada: string = '';
  salario: number= 0;
  // Nuevos campos
  puesto: string = '';
  empresa: string = '';
  get showCampos() {
    return this.trabajaRelacionada === 'si';
  }

  constructor(private testimonioService: TestimonioService) {}

  agregarTestimonio() {
    // Validación básica incluyendo los nuevos campos solo si trabajaRelacionada es 'si'
    if (!this.nombre || !this.carrera || !this.experiencia || !this.trabajaRelacionada) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    if (this.trabajaRelacionada === 'si' && (!this.puesto || !this.empresa)) {
      alert("Por favor, completa los datos de tu trabajo.");
      return;
    }
const testimonio: Testimonio = {
  nombre: this.nombre,
  carrera: this.carrera,
  experiencia: this.experiencia,
  trabajaRelacionada: this.trabajaRelacionada,
  puesto: this.trabajaRelacionada === 'si' ? this.puesto : undefined,
  empresa: this.trabajaRelacionada === 'si' ? this.empresa : undefined
};

    console.log("Testimonio enviado:", testimonio);

    this.testimonioService.agregarTestimonio(testimonio);

    // Limpiar campos
    this.nombre = '';
    this.carrera = '';
    this.experiencia = '';
    this.trabajaRelacionada = '';
    this.puesto = '';
    this.empresa = '';
   
  }

}