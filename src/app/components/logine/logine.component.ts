import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { BrowserQRCodeReader } from '@zxing/browser';


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
  showCamera: boolean = false;

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
  
      const responseText = await response.text(); // 🔍 Capturamos la respuesta como texto
  
      if (!response.ok) {
        throw new Error(`Error en la API: ${response.status} - ${responseText}`);
      }
  
      const data = JSON.parse(responseText); // Intentamos parsear JSON
  
      console.log("Respuesta de la API:", data); // 📌 Verifica qué devuelve la API
  
      // Comparar carreras
      const carreraApi = data.carrera?.trim().toUpperCase();
      const carreraSeleccionada = this.carrerasMap[this.carrera]?.trim().toUpperCase();
  
      if (carreraApi === carreraSeleccionada) {
        Swal.fire('Éxito', 'Verificación completada correctamente.', 'success').then(() => {
          this.currentStep = 3;
        });
      } else {
        Swal.fire('Error', `La información no coincide. Carrera en API: ${data.carrera}`, 'error');
      }
    }  catch (error: unknown) {
      console.error("Error al comunicarse con la API:", error);
    
      // Convertimos error a tipo Error para acceder a `.message`
      let errorMessage = "Error desconocido";
    
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error; // Si el error es un string, lo usamos directamente
      }
    
      Swal.fire('Error', `Hubo un problema al comunicarse con la API: ${errorMessage}`, 'error');
    }
    
  }
  

  startScan() {
    this.showCamera = true;
    // Aquí puedes agregar la lógica para iniciar el escaneo del QR con la cámara.
    // Esto se puede hacer con una librería como ZXing o similar.
  }
  
  scanQrFromImage(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
  
    if (file) {
      // Lógica para procesar el archivo de imagen y extraer el QR de la imagen
      this.processQrImage(file); // Llama a una función para procesar la imagen
    }
  }
  
  scanQr() {
    if (!this.qrLink) {
      Swal.fire('Error', 'Por favor, ingresa el enlace de tu código QR.', 'error');
      return;
    }
  
    // Si se ha ingresado un enlace de QR, realiza la verificación
    this.verifyQrLink(this.qrLink);
  }
  
  async verifyQrLink(qrLink: string) {
    try {
      const response = await fetch("https://zr8f0150c8.execute-api.us-east-2.amazonaws.com/Dev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: qrLink })
      });
  
      if (!response.ok) {
        throw new Error("Error al comunicarse con la API.");
      }
  
      const data = await response.json();
      
      // Comparar la carrera y hacer la verificación
      const carreraApi = data.carrera.trim().toUpperCase();
      const carreraSeleccionada = this.carrerasMap[this.carrera].trim().toUpperCase();
  
      if (carreraApi === carreraSeleccionada) {
        Swal.fire('Éxito', 'Verificación completada correctamente.', 'success').then(() => {
          this.currentStep = 3;
        });
      } else {
        Swal.fire('Error', `La información no coincide. Carrera: ${data.carrera}`, 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Hubo un problema al comunicarse con la API.', 'error');
      console.error(error);
    }
  }
  
  processQrImage(file: File) {
    const reader = new FileReader();
  
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const img = new Image();
      img.onload = async () => {
        try {
          const codeReader = new BrowserQRCodeReader();
          const result = await codeReader.decodeFromImageUrl(img.src); // ✅ Corrección aquí
  
          this.qrLink = result.getText(); // ✅ Extrae el texto del QR
          Swal.fire('QR Escaneado', `Código QR detectado con éxito: ${this.qrLink}`, 'success');
        } catch (error) {
          Swal.fire('Error', 'No se pudo escanear el QR de la imagen.', 'error');
          console.error(error);
        }
      };
  
      img.src = e.target?.result as string;
    };
  
    reader.readAsDataURL(file);
  }
  
}
