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

  codeReader= new BrowserQRCodeReader();
  mediaStream!: MediaStream;
   carreraTouched: boolean = false; // Variable para controlar el "touched"


  // Expresión regular para validar la contraseña
  passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;


  // Expresión regular para validar el email
  emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  

  /** Valida el campo de carrera al ser tocado **/// Expresión regular para validar solo letras
  namePattern = /^[A-Za-záéíóúÁÉÍÓÚ]+( [A-Za-záéíóúÁÉÍÓÚ]+)*$/;

   /** Valida la contraseña en tiempo real **/
  validatePassword(): void {
    if (!this.passwordPattern.test(this.password)) {
      // Mostrar un mensaje si la contraseña no cumple con los requisitos
      this.passwordError = 'La contraseña debe contener al menos una mayúscula, un número y un carácter especial.';
    } else {
      // Limpiar el error si la contraseña es válida
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
    private loader: LoaderService,private router: Router ) {}

  goNext(event: Event) {
    event.preventDefault(); // Evita la recarga de la página

    if (this.currentStep === 1 && this.validateStep1()) {
      // En lugar de registrar aquí, simplemente avanzamos al siguiente paso
      this.currentStep++;
    } else if (this.currentStep === 2) {
      this.validateStep2();
    }
  }




 validateStep1(): boolean {

    // Validamos los campos del formulario  // Expresión regular para validar solo letras
    const namePattern = /^[A-Za-záéíóúÁÉÍÓÚ]+( [A-Za-záéíóúÁÉÍÓÚ]+)*$/;

    // Validación del nombre
    if (!namePattern.test(this.firstName)) {
      this.snackBar.open('El nombre no puede contener números ni caracteres especiales.', 'OK', {
        duration: 4000,
        panelClass: ['warning-snackbar']
      });
      return false;  // Si el nombre no es válido, no avanzamos
    }

    // Validación del apellido
    if (!namePattern.test(this.lastName)) {
      this.snackBar.open('El apellido no puede contener números ni caracteres especiales.', 'OK', {
        duration: 4000,
        panelClass: ['warning-snackbar']
      });
      return false;  // Si el apellido no es válido, no avanzamos
    }

    this.validatePassword();
    this.validateEmail();

    if (!this.firstName || !this.lastName || !this.email || !this.password || this.carrera === 'Selecciona tu carrera') {
      Swal.fire('Error', 'Por favor, completa todos los campos.', 'error');
      return false;  // Si algún campo está vacío, no avanzamos al siguiente paso
    }

    if (this.passwordError || this.emailError) {
      Swal.fire('Error', 'Corrige los errores antes de continuar.', 'error');
      return false;
    }
    return true;  // Si todos los campos están completos y no hay errores, avanzamos
  }


async validateStep2() {
  if (!this.qrLink) {
    Swal.fire('Error', 'Por favor, ingresa el enlace de tu código QR.', 'error');
    return;
  }

  console.log("🔹 Enviando QR a la API:", this.qrLink);

  // Mostrar alerta de carga
  Swal.fire({
    title: 'Verificando QR...',
    html: 'Por favor espera, estamos validando la información...',
    timerProgressBar: true,
    showConfirmButton: false,
    willOpen: () => {
      Swal.showLoading(); // Muestra el indicador de carga
    }
  });

  // Simulamos un pequeño retraso para asegurar que la alerta de carga aparezca
  await new Promise(resolve => setTimeout(resolve, 500)); // 500ms de espera

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
    // Cerrar el mensaje de carga con Swal.close() después de la verificación
    Swal.close();
  }
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

  // Mostrar alerta de carga antes de realizar la validación
  Swal.fire({
    title: 'Verificando QR...',
    html: 'Por favor espera, estamos validando la información...',
    timerProgressBar: true,
    showConfirmButton: false,
    willOpen: () => {
      Swal.showLoading(); // Mostrar el indicador de carga
    }
  });

  // Llamar a la función para verificar el QR después de mostrar el cargando
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
    const signUpData = {
      nombre: this.firstName,
      apellido: this.lastName,
      email: this.email,
      password: this.password,
      role: 'ROLE_EGRESADO',  // Especificamos el rol
      carrera: parseInt(this.carrera) // Convertimos a número
    };

    // Mostramos pantalla de carga mientras se registra
    this.loader.mostrarCargando('Registrando cuenta...');

    // Llamada a la API para registrar la cuenta
    this.authService.registerEgresado(signUpData).subscribe({
      next: () => {
        this.loader.ocultarCargando();
        // Aquí se almacena la sesión. Si la API devuelve token, se debería usar ese valor.
        this.authService.storeUserSession(this.email, 'FAKE_TOKEN', 'ROLE_EGRESADO');
        Swal.fire('Cuenta creada con éxito', 'Tu cuenta ha sido registrada correctamente.', 'success').then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (error) => {
        this.loader.ocultarCargando();
        console.error("❌ Error en el registro:", error);
         Swal.fire('Error', `No se pudo registrar la cuenta: ${error.message}`, 'error').then(() => {
        this.router.navigate(['/logine']);  // Redirige al login en caso de error
      });
      }
    });
  }



  isEditing: boolean = false; // Controla si los campos están en modo de edición

  // Método para alternar el modo de edición
  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }



 // Método para guardar los cambios
  saveData(): void {
    // Validar el nombre y apellido
    
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

     // Validar el correo
    if (!this.emailPattern.test(this.email)) {
      this.snackBar.open('El correo debe tener un formato válido.', 'OK', {
        duration: 4000,
        panelClass: ['warning-snackbar']
      });
      return;
    }


    // Aquí puedes agregar la lógica para guardar los datos
    console.log('Datos guardados', { firstName: this.firstName, lastName: this.lastName, email: this.email });
    this.isEditing = false; // Desactivar modo de edición
  }

 
  // Método para verificar si todos los campos son válidos
  isValid(): boolean {
    // Verificar explícitamente que los campos no estén vacíos y que el email tenga un formato válido
    const isFirstNameValid = !!(this.firstName && this.firstName.trim().length > 0);
    const isLastNameValid = !!(this.lastName && this.lastName.trim().length > 0);
    const isEmailValid = !!(this.email && this.emailPattern.test(this.email));

    // Retorna un valor booleano
    return isFirstNameValid && isLastNameValid && isEmailValid;
  }


  // Variable que controla si la contraseña es visible
  isPasswordVisible: boolean = false;

  // Método para alternar la visibilidad de la contraseña
 
  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

}
