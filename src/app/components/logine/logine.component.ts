import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { BrowserQRCodeReader } from '@zxing/browser';
import { ApiService } from '../../services/api.service';



@Component({
  selector: 'app-logine',
  standalone: true,
  imports: [RouterModule, CommonModule, IonicModule, FormsModule],
  templateUrl: './logine.component.html',
  styleUrls: ['./logine.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LogineComponent {

  @ViewChild('videoElement', {static: false}) videoElement!:ElementRef<HTMLVideoElement>

  currentStep: number = 1;
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  carrera: string = '';
  qrLink: string = '';
  showCamera: boolean = false;

  codeReader= new BrowserQRCodeReader();
  mediaStream!: MediaStream;

  carrerasMap: any = {
    "1": "INGENIERÍA EN SISTEMAS COMPUTACIONALES",
    "2": "Licenciatura en Ciencia de Datos",
    "3": "Ingeniería en Inteligencia Artificial",
  };

  constructor(private apiService: ApiService) {}

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
  
    console.log("🔹 Enviando QR a la API:", this.qrLink);
  
    this.apiService.verifyQr(this.qrLink).subscribe({
      next: (data) => {
        console.log("✅ Respuesta de la API:", data);
  
        const carreraApi = data.carrera?.trim().toUpperCase();
        const carreraSeleccionada = this.carrerasMap[this.carrera]?.trim().toUpperCase();
  
        console.log("📌 Carrera en API:", carreraApi);
        console.log("📌 Carrera seleccionada por el usuario:", carreraSeleccionada);
  
        if (!carreraApi) {
          console.error("❌ Error: La API no devolvió información de carrera.");
          Swal.fire('Error', 'No se pudo obtener la carrera del QR.', 'error');
          return;
        }
  
        if (carreraApi !== carreraSeleccionada) {
          console.warn("⚠️ Carrera no coincide. No se permite avanzar.");
          Swal.fire('Error', `La información no coincide. Carrera en API: ${data.carrera}`, 'error');
          return;
        }
  
        console.log("✅ Carrera validada correctamente. Avanzando al Paso 3.");
        Swal.fire('Éxito', 'Verificación completada correctamente.', 'success').then(() => {
          this.currentStep = 3;
        });
      },
      error: (error) => {
        console.error("⚠️ Error en la verificación:", error);
        Swal.fire('Error', 'Hubo un problema al comunicarse con la API.', 'error');
      }
    });
    
  }
  

  async startScan() {
    this.showCamera = true;
    // Aquí puedes agregar la lógica para iniciar el escaneo del QR con la cámara.
    // Esto se puede hacer con una librería como ZXing o similar.

    try{
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      const video = this.videoElement.nativeElement;
      video.srcObject = this.mediaStream;
      video.play();

      // Inicia la detección continua
      this.scanQrContinuously();
    } catch (error) {
      console.error('Error al acceder a la cámara:', error);
      Swal.fire('Error', 'No se pudo acceder a la cámara.', 'error');
    }
  }

   /** Escanea QR continuamente desde el video **/
   async scanQrContinuously() {
    this.codeReader.decodeFromVideoElement(
      this.videoElement.nativeElement,
      (result, error) => {
        if (result) {
          this.qrLink = result.getText();
          Swal.fire('Código QR detectado', `Contenido: ${this.qrLink}`, 'success');
          this.verifyQrLink(this.qrLink);
          this.stopScan(); // Detiene la cámara después de escanear
        }
  
        if (error) {
          console.warn('Esperando código QR...', error);
        }
      }
    ).catch(err => {
      console.error('Error al iniciar escaneo:', err);
    });
  }

   /** Detiene el escaneo y cierra la cámara **/
   stopScan() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
    }
    this.showCamera = false;
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

    console.log("🔹 Verificando QR...");
    console.log("📌 Datos antes de cambiar al paso 3:", {
      firstName: this.firstName,
      lastName: this.lastName,
      carrera: this.carrera,
      email: this.email,
    });

    if (!this.firstName || !this.lastName || !this.carrera || !this.email) {
      Swal.fire('Error', 'Los datos del usuario están vacíos. Por favor, regresa y completa el formulario.', 'error');
      console.error("⚠️ Datos vacíos:", {
        firstName: this.firstName,
        lastName: this.lastName,
        carrera: this.carrera,
        email: this.email
      });
      return;
    }
    
    this.verifyQrLink(this.qrLink);

    
}

verifyQrLink(qrLink: string) {
  console.log("🔹 Verificando QR con la API:", qrLink);

  this.apiService.verifyQr(qrLink).subscribe({
    next: (data) => {
      console.log("✅ Respuesta de la API:", data);

      const carreraApi = data.carrera?.trim().toUpperCase();
      const carreraSeleccionada = this.carrerasMap[this.carrera]?.trim().toUpperCase();

      console.log("📌 Carrera en API:", carreraApi);
      console.log("📌 Carrera seleccionada por el usuario:", carreraSeleccionada);

      if (!carreraApi) {
        console.error("❌ Error: La API no devolvió información de carrera.");
        Swal.fire('Error', 'No se pudo obtener la carrera del QR.', 'error');
        return;
      }

      if (carreraApi !== carreraSeleccionada) {
        console.warn("⚠️ Carrera no coincide. No se permite avanzar.");
        Swal.fire('Error', `La información no coincide. Carrera en API: ${data.carrera}`, 'error');
        return;
      }

      console.log("✅ Carrera validada correctamente. Avanzando al Paso 3.");
      Swal.fire('Éxito', 'Verificación completada correctamente.', 'success').then(() => {
        this.currentStep = 3;
      });
    },
    error: (error) => {
      console.error("⚠️ Error en la verificación:", error);
      Swal.fire('Error', 'Hubo un problema al comunicarse con la API.', 'error');
    }
  });
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
  goToStep(step: number) {
    this.currentStep = step;
  }

  finalizeAccount() {
    Swal.fire('Cuenta creada con éxito', 'Tu cuenta ha sido registrada correctamente.', 'success');
    // Aquí podrías redirigir a otra página o realizar alguna acción adicional
  }

  
}
