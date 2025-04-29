import { Component } from '@angular/core';
import { TestimonioService } from '../../services/testimonio.service'; // Asegúrate de que el servicio esté importado
import { Testimonio } from '../../models/testimonio.model';  // Importa el modelo Testimonio
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-experence',
  imports: [FormsModule ],
  templateUrl: './experence.component.html',
  styleUrls: ['./experence.component.css']
})

export class ExperenceComponent {

  nombre: string = '';
  carrera: string = '';
  experiencia: string = '';
  trabajaRelacionada: string = '';  // Asegúrate de que el valor predeterminado sea un string vacío o uno válido

  constructor(private testimonioService: TestimonioService) {}

  agregarTestimonio() {
    console.log("Campos:", this.nombre, this.carrera, this.experiencia, this.trabajaRelacionada);
  
    if (!this.nombre || !this.carrera || !this.experiencia || !this.trabajaRelacionada) {
      alert("Por favor, completa todos los campos.");
      return;
    }
  
    const testimonio: Testimonio = {
      nombre: this.nombre,
      carrera: this.carrera,
      experiencia: this.experiencia,
      trabajaRelacionada: this.trabajaRelacionada
    };
  
    console.log("Testimonio enviado:", testimonio);
  
    this.testimonioService.agregarTestimonio(testimonio);
  
    this.nombre = '';
    this.carrera = '';
    this.experiencia = '';
    this.trabajaRelacionada = '';
  }
  
}