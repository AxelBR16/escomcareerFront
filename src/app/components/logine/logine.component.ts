import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-logine',
  standalone: true,
  imports: [RouterModule, CommonModule, IonicModule, FormsModule],
  templateUrl: './logine.component.html',
  styleUrls: ['./logine.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LogineComponent {
  currentStep: number = 1;
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  carrera: string = '';
  qrLink: string = '';

  scanQr() {
    Swal.fire('Escaneo en proceso', 'Por favor, escanea tu código QR.', 'info');
    // Aquí podrías agregar la lógica real para el escaneo de QR
  }

  carrerasMap: any = {
    "1": "INGENIERÍA EN SISTEMAS COMPUTACIONALES",
    "2": "Licenciatura en Ciencia de Datos",
    "3": "Ingeniería en Inteligencia Artificial",
  };

  constructor() {}

  
  goNext(event: Event) {
    event.preventDefault();  // Evita la recarga de la página
  
    if (this.currentStep === 1 && this.validateStep1()) {
      this.currentStep++;  // Avanza al siguiente paso
    } else if (this.currentStep === 2) {
      this.validateStep2();
    }
  }
  
  
  

  validateStep1(): boolean {
    if (!this.firstName || !this.lastName || !this.email || !this.password || this.carrera === 'Selecciona tu carrera') {
      Swal.fire('Error', 'Por favor, completa todos los campos.', 'error');
      return false;  // Si algún campo está vacío, no avanzamos al siguiente paso
    }
    return true;  // Si todos los campos están completos, avanzamos al siguiente paso
  }
  

  async validateStep2() {
    if (!this.qrLink) {
      Swal.fire('Error', 'Por favor, ingresa el enlace de tu código QR.', 'error');
      return;
    }
    try {
      const response = await fetch("https://zr8f0150c8.execute-api.us-east-2.amazonaws.com/Dev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: this.qrLink })
      });
      
      if (!response.ok) {
        throw new Error("Error al comunicarse con la API.");
      }

      const data = await response.json();

      if (data.escuela === "ESCOM" && data.carrera === this.carrerasMap[this.carrera]) {
        Swal.fire('Éxito', 'Verificación completada correctamente.', 'success').then(() => {
          this.currentStep++;
        });
      } else {
        Swal.fire('Error', `La información no coincide. Escuela: ${data.escuela}, Carrera: ${data.carrera}`, 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Hubo un problema al comunicarse con la API.', 'error');
      console.error(error);
    }
  }
}
