import { AuthService } from './../../services/auth.service';

import { Component, OnInit, ViewChild, ElementRef, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { SignIn } from '../../models/sign-in';
import { SignUpAspirante } from '../../models/sign-up-aspirante';
import { LoaderService } from '../../services/loader.service';
import { MatSnackBar } from '@angular/material/snack-bar'


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private snackBar = inject(MatSnackBar);

  @ViewChild('contenedor') contenedor!: ElementRef;

  constructor(private authService: AuthService, private router: Router, private loader: LoaderService){ }

  
  // Campos para el registro (sign-up)
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';

  // Campos para el inicio de sesión (sign-in)
  loginEmail: string = '';
  loginPassword: string = '';

  /**/
  showPasswordHint: boolean = false;
  passwordError: string = '';
  emailError: string = '';

  // Expresión regular para validar la contraseña (mínimo 8 caracteres, 1 mayúscula, 1 número y 1 caracter especial)
  passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
     namePattern = /^[A-Za-záéíóúÁÉÍÓÚ]+( [A-Za-záéíóúÁÉÍÓÚ]+)*$/;
  // Expresión regular para validar el email
  emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  loading=false;

   async ngOnInit() {
    // Verificar si el usuario ya está logueado
    const isLoggedIn = await this.authService.isLoggedIn();

    // Si ya está logueado, obtener el rol y redirigir a la página correspondiente
    if (isLoggedIn) {
      try {
        const userRole = await this.authService.getCurrentUserRole();

        // Redirigir según el rol
        if (userRole === 'ROLE_ASPIRANTE') {
          this.router.navigate(['/aspirante-dashboard']); // Redirige al dashboard de aspirante
        } else if (userRole === 'ROLE_EGRESADO') {
          this.router.navigate(['/egresado-dashboard']); // Redirige al dashboard de egresado
        } else {
          // Si el rol no es válido, redirige a la página principal o login
          this.router.navigate(['/inicio']);
        }
      } catch (error) {
        console.error('Error al obtener el rol del usuario:', error);
        this.router.navigate(['/login']);
      }
    }
  }

  // Valida la contraseña en tiempo real
  validatePassword() {
    if (!this.passwordPattern.test(this.password)) {
      this.passwordError = 'Debe contener al menos 1 mayúscula, 1 número y 1 carácter especial.';
    } else {
      this.passwordError = '';
    }
  }

  // Valida el formato del email en tiempo real
  validateEmail() {
    if (!this.emailPattern.test(this.email)) {
      this.emailError = 'El formato del correo electrónico no es válido.';
    } else {
      this.emailError = '';
    }
  }



  // Al presionar "Aspirante", se agrega la clase "active" al contenedor para mostrar el formulario de registro.
  toggleAspirante(): void {
    if (this.contenedor) {
      this.contenedor.nativeElement.classList.add('active');
    }
  }

  // (Opcional) Al presionar "Iniciar sesión" en el panel izquierdo, se quita la clase "active" para volver a la vista de login.
  toggleIniciarSesion(): void {
    if (this.contenedor) {
      this.contenedor.nativeElement.classList.remove('active');
    }
  }

  onRegisterSubmit(event: Event): void {
    event.preventDefault();

    this.validatePassword();
    this.validateEmail();



      // Validación del nombre (sin números ni caracteres especiales)
  const namePattern = /^[A-Za-záéíóúÁÉÍÓÚ]+( [A-Za-záéíóúÁÉÍÓÚ]+)*$/;


  if (!namePattern.test(this.firstName)) {
    this.snackBar.open('El nombre no puede contener números ni caracteres especiales', 'OK', {
      duration: 4000,
      panelClass: ['warning-snackbar']
    });
    return;
  }

  // Validación del apellido (sin números ni caracteres especiales)
  if (!namePattern.test(this.lastName)) {
    this.snackBar.open('El apellido no puede contener números ni caracteres especiales', 'OK', {
      duration: 4000,
      panelClass: ['warning-snackbar']
    });
    return;
  }

 // Validación de correo electrónico antes de enviar
  if (!this.emailPattern.test(this.email)) {
    this.snackBar.open('Por favor, ingresa un correo electrónico válido.', 'OK', {
      duration: 4000,
      panelClass: ['warning-snackbar']
    });
    return;  // No continuar si el correo no es válido
  }

  
  // Validación de la contraseña antes de continuar
  if (!this.passwordPattern.test(this.password)) {
    this.snackBar.open('La contraseña debe contener al menos una mayúscula, un número y un carácter especial.', 'OK', {
      duration: 4000,
      panelClass: ['warning-snackbar']
    });
    return;  // No continuar si la contraseña no es válida
  }

    if (this.firstName && this.lastName && this.email && this.password) {
      this.loader.mostrarCargando('Verificando credenciales...');
      const signUpData: SignUpAspirante = {
        nombre: this.firstName,
        apellido: this.lastName,
        email: this.email,
        password: this.password,
        role: 'ROLE_ASPIRANTE' /* ROLE_EGRESADO */
      };
      this.authService.registerAspirante(signUpData).subscribe({
        next: (response) => {
          this.loader.ocultarCargando();
          console.log('Registro completado:', response);
          this.toggleIniciarSesion();
          Swal.fire({
            icon: 'success',
            title: 'Registro exitoso',
            text: '¡Tu cuenta ha sido creada correctamente!',
            confirmButtonText: 'Aceptar'
          });
        },
        error: (error) => {
          this.loader.ocultarCargando();
          Swal.fire({
            icon: 'error',
            title: 'Error en el registro',
            text: error,
            confirmButtonText: 'Aceptar'
          });
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error en el registro',
        text: 'Por favor, completa todos los campos',
        confirmButtonText: 'Aceptar'
      });
    }
  }




  // Manejador del formulario de inicio de sesión
  onLoginSubmit(event: Event): void {
    event.preventDefault();


     // Validación de correo
    if (!this.emailPattern.test(this.loginEmail)) {
      this.snackBar.open('Por favor ingresa un correo válido.', 'OK', {
        duration: 4000,
        panelClass: ['warning-snackbar']
      });
      return;
    }

    // Validación de contraseña
    if (!this.passwordPattern.test(this.loginPassword)) {
      this.snackBar.open('La contraseña debe tener al menos una mayúscula, un número y un carácter especial.', 'OK', {
        duration: 4000,
        panelClass: ['warning-snackbar']
      });
      return;
    }


    if (this.loginEmail && this.loginPassword) {
      const signInData: SignIn = {
        email: this.loginEmail,
        password: this.loginPassword
      };
      this.loading = true;
      this.authService.login(signInData).subscribe({
        next: (response) => {
          this.snackBar.open('✅ ¡Sesión iniciada con éxito! Disfruta tu experiencia. 🚀', 'OK', {
            duration: 9000,
            panelClass: ['custom-snackbar']
          });
          this.loading = false;
          this.authService.storeUserSession(this.loginEmail, response.token, response.role);
          if (response.role === 'ROLE_ADMIN') {
            this.router.navigate(['/admin-dashboard']);
          } else if (response.role === 'ROLE_EGRESADO') {
            this.router.navigate(['/egresado-dashboard']);
          } else if (response.role === 'ROLE_ASPIRANTE') {
            this.router.navigate(['/aspirante-dashboard']);
          }
        },
        error: (error) => {
          this.loading = false;
          Swal.fire({
            icon: 'error',
            title: 'Error en el inicio de sesión',
            text: error.message,
            confirmButtonText: 'Aceptar'
          });
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error en el inicio de sesión',
        text: 'Por favor, ingresa tus credenciales',
        confirmButtonText: 'Aceptar'
      });
    }
  }

  
  // Variable que controla si la contraseña es visible
  isPasswordVisible: boolean = false;

  // Método para alternar la visibilidad de la contraseña
 
  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }


  

}
