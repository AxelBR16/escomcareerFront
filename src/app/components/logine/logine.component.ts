import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { BrowserQRCodeReader } from '@zxing/browser';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { LoaderService } from '../../services/loader.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  
  showPasswordHint: boolean = false;
  passwordError: string = '';
  emailError: string = '';

  codeReader = new BrowserQRCodeReader();
  mediaStream!: MediaStream;
  carreraTouched: boolean = false;
  isScanning: boolean = false; // 🔧 ADD: Flag to control scanning state

  // Expresión regular para validar la contraseña
  passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  // Expresión regular para validar el email
  emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  // Expresión regular para validar solo letras
  namePattern = /^[A-Za-záéíóúÁÉÍÓÚ]+( [A-Za-záéíóúÁÉÍÓÚ]+)*$/;

  /** Valida la contraseña en tiempo real **/
  validatePassword(): void {
    if (!this.passwordPattern.test(this.password)) {
      this.passwordError = 'La contraseña debe contener al menos una mayúscula, un número y un carácter especial.';
    } else {
      this.passwordError = '';
    }
  }

  /** Valida el formato del email en tiempo real **/
  validateEmail() {
    if (!this.emailPattern.test(this.email)) {
      this.emailError = 'El formato del correo electrónico no es válido.';
    } else {
      this.emailError = '';
    }
  }

  carrerasMap: any = {
    "1": "INGENIERÍA EN SISTEMAS COMPUTACIONALES",
    "2": "Licenciatura en Ciencia de Datos",
    "3": "Ingeniería en Inteligencia Artificial",
  };

  constructor(private apiService: ApiService,  
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private loader: LoaderService,
    private router: Router) {}

  goNext(event: Event) {
    event.preventDefault();

    if (this.currentStep === 1 && this.validateStep1()) {
      this.currentStep++;
    } else if (this.currentStep === 2) {
      this.validateStep2();
    }
  }

  validateStep1(): boolean {
    const namePattern = /^[A-Za-záéíóúÁÉÍÓÚ]+( [A-Za-záéíóúÁÉÍÓÚ]+)*$/;

    if (!namePattern.test(this.firstName)) {
      this.snackBar.open('El nombre no puede contener números ni caracteres especiales.', 'OK', {
        duration: 4000,
        panelClass: ['warning-snackbar']
      });
      return false;
    }

    if (!namePattern.test(this.lastName)) {
      this.snackBar.open('El apellido no puede contener números ni caracteres especiales.', 'OK', {
        duration: 4000,
        panelClass: ['warning-snackbar']
      });
      return false;
    }

    this.validatePassword();
    this.validateEmail();

    if (!this.firstName || !this.lastName || !this.email || !this.password || this.carrera === 'Selecciona tu carrera') {
      Swal.fire('Error', 'Por favor, completa todos los campos.', 'error');
      return false;
    }

    if (this.passwordError || this.emailError) {
      Swal.fire('Error', 'Corrige los errores antes de continuar.', 'error');
      return false;
    }
    return true;
  }

  async validateStep2() {
    if (!this.qrLink) {
      Swal.fire('Error', 'Por favor, ingresa el enlace de tu código QR.', 'error');
      return;
    }

    console.log("🔹 Enviando QR a la API:", this.qrLink);

    Swal.fire({
      title: 'Verificando QR...',
      html: 'Por favor espera, estamos validando la información...',
      timerProgressBar: true,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      }
    });

    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const data = await this.apiService.verifyQr(this.qrLink).toPromise();

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

    } catch (error) {
      console.error("⚠️ Error en la verificación:", error);
      Swal.fire('Error', 'Hubo un problema al comunicarse con la API.', 'error');
    } finally {
      Swal.close();
    }
  }

  async startScan() {
    // 🔧 FIX: Check if already scanning to prevent multiple scans
    if (this.isScanning) {
      console.log("⚠️ Ya se está escaneando, ignorando nueva solicitud");
      return;
    }

    this.showCamera = true;
    this.isScanning = true; // 🔧 FIX: Set scanning flag

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      const video = this.videoElement.nativeElement;
      video.srcObject = this.mediaStream;
      video.play();

      this.scanQrContinuously();
    } catch (error) {
      console.error('Error al acceder a la cámara:', error);
      this.isScanning = false; // 🔧 FIX: Reset flag on error
      Swal.fire('Error', 'No se pudo acceder a la cámara.', 'error');
    }
  }

  /** 🔧 FIXED: Escanea QR continuamente desde el video **/
  async scanQrContinuously() {
    if (!this.isScanning) {
      return; // 🔧 FIX: Stop if not scanning
    }

    // 🔧 FIX: Use the callback version of decodeFromVideoElement
    try {
      this.codeReader.decodeFromVideoElement(
        this.videoElement.nativeElement,
        (result, error) => {
          if (result && this.isScanning) {
            // QR Code encontrado
            this.qrLink = result.getText();
            console.log("✅ QR detectado:", this.qrLink);
            
            // 🔧 FIX: Stop scanning immediately when QR is found
            this.stopScan();
            
            Swal.fire('Código QR detectado', `Contenido: ${this.qrLink}`, 'success');
            
            // 🔧 FIX: Verify QR after stopping the scan
            this.verifyQrLink(this.qrLink);
          }

          if (error && this.isScanning) {
            // Si es NotFoundException, continúa buscando (es normal)
            if (error.name !== 'NotFoundException') {
              console.error('Error durante el escaneo:', error);
              this.stopScan();
              Swal.fire('Error', 'Error durante el escaneo del QR.', 'error');
            }
            // Si es NotFoundException, simplemente continúa escaneando automáticamente
          }
        }
      );
    } catch (error) {
      console.error('Error al iniciar el escaneo:', error);
      this.stopScan();
      Swal.fire('Error', 'Error al iniciar el escaneo del QR.', 'error');
    }
  }

  /** 🔧 FIXED: Detiene el escaneo y cierra la cámara **/
  stopScan() {
    console.log("🛑 Deteniendo escaneo...");
    
    this.isScanning = false; // 🔧 FIX: Set scanning flag to false
    
    // 🔧 FIX: Stop media stream first
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => {
        track.stop();
        console.log("📹 Track detenido:", track.kind);
      });
      this.mediaStream = null as any; // 🔧 FIX: Clear reference
    }
    
    // 🔧 FIX: Clear video element
    if (this.videoElement?.nativeElement) {
      this.videoElement.nativeElement.srcObject = null;
      // Pause the video element
      this.videoElement.nativeElement.pause();
    }
    
    // 🔧 FIX: Create a new instance of the code reader to "reset" it
    try {
      this.codeReader = new BrowserQRCodeReader();
    } catch (error) {
      console.warn("No se pudo recrear el code reader:", error);
    }
    
    this.showCamera = false;
    console.log("✅ Escaneo detenido completamente");
  }

  scanQrFromImage(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.processQrImage(file);
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

    Swal.fire({
      title: 'Verificando QR...',
      html: 'Por favor espera, estamos validando la información...',
      timerProgressBar: true,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      }
    });

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
          const result = await codeReader.decodeFromImageUrl(img.src);

          this.qrLink = result.getText();
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
    const signUpData = {
      nombre: this.firstName,
      apellido: this.lastName,
      email: this.email,
      password: this.password,
      role: 'ROLE_EGRESADO',
      carrera: parseInt(this.carrera)
    };

    this.loader.mostrarCargando('Registrando cuenta...');

    this.authService.registerEgresado(signUpData).subscribe({
      next: () => {
        this.loader.ocultarCargando();
        this.authService.storeUserSession(this.email, 'FAKE_TOKEN', 'ROLE_EGRESADO');
        Swal.fire('Cuenta creada con éxito', 'Tu cuenta ha sido registrada correctamente.', 'success').then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (error) => {
        this.loader.ocultarCargando();
        console.error("❌ Error en el registro:", error);
        Swal.fire('Error', `No se pudo registrar la cuenta: ${error.message}`, 'error').then(() => {
          this.router.navigate(['/logine']);
        });
      }
    });
  }

  isEditing: boolean = false;

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  saveData(): void {
    if (!this.namePattern.test(this.firstName)) {
      this.snackBar.open('El nombre no puede contener números ni caracteres especiales.', 'OK', {
        duration: 4000,
        panelClass: ['warning-snackbar']
      });
      return;
    }

    if (!this.namePattern.test(this.lastName)) {
      this.snackBar.open('El apellido no puede contener números ni caracteres especiales.', 'OK', {
        duration: 4000,
        panelClass: ['warning-snackbar']
      });
      return;
    }

    if (!this.emailPattern.test(this.email)) {
      this.snackBar.open('El correo debe tener un formato válido.', 'OK', {
        duration: 4000,
        panelClass: ['warning-snackbar']
      });
      return;
    }

    console.log('Datos guardados', { firstName: this.firstName, lastName: this.lastName, email: this.email });
    this.isEditing = false;
  }

  isValid(): boolean {
    const isFirstNameValid = !!(this.firstName && this.firstName.trim().length > 0);
    const isLastNameValid = !!(this.lastName && this.lastName.trim().length > 0);
    const isEmailValid = !!(this.email && this.emailPattern.test(this.email));

    return isFirstNameValid && isLastNameValid && isEmailValid;
  }

  isPasswordVisible: boolean = false;

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  // 🔧 ADD: Component cleanup method
  ngOnDestroy() {
    this.stopScan(); // Ensure camera is stopped when component is destroyed
  }
}