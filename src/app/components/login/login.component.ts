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

  // Expresión regular para validar el email
  emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  loading=false;

  ngOnInit(): void {
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

          console.log(sessionStorage.getItem('role'))
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
