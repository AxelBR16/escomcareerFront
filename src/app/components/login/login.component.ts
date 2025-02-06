import { AuthService } from './../../services/auth.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { SignUp } from '../../models/sign-up';
import { SignIn } from '../../models/sign-in';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // Referencia al contenedor principal para activar las transiciones
  @ViewChild('contenedor') contenedor!: ElementRef;

  constructor(private authService: AuthService, private router: Router){ }

  // Campos para el registro (sign-up)
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';

  // Campos para el inicio de sesión (sign-in)
  loginEmail: string = '';
  loginPassword: string = '';

  ngOnInit(): void {
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

  // Manejador del formulario de registro
  onRegisterSubmit(event: Event): void {
    event.preventDefault();
    if (this.firstName && this.lastName && this.email && this.password) {
      const signUpData: SignUp = {
        nombre: this.firstName,
        apellido: this.lastName,
        email: this.email,
        password: this.password
      };
      this.authService.register(signUpData).subscribe({
        next: (response) => {
          console.log('Registro completado:', response);
          Swal.fire({
            icon: 'success',
            title: 'Registro exitoso',
            text: '¡Tu cuenta ha sido creada correctamente!',
            confirmButtonText: 'Aceptar'
          });
          this.router.navigate(['/login']);      },
        error: (error) => {
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
      this.authService.login(signInData).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Inicio de sesión exitoso',
            text: 'Bienvenido de nuevo',
            confirmButtonText: 'Aceptar'
          });
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.role);
          // Redirigir según el rol del usuario
          if (response.role === 'ROLE_ADMIN') {
            this.router.navigate(['/admin-dashboard']);
          } else if (response.role === 'ROLE_EGRESADO') {
            this.router.navigate(['/egresado-dashboard']);
          } else if (response.role === 'ROLE_ASPIRANTE') {
            this.router.navigate(['/aspirante-dashboard']);
          }
        },
        error: (error) => {
          let errorMessage = error?.error?.message || 'Error en el inicio de sesión. Inténtalo nuevamente.';

          Swal.fire({
            icon: 'error',
            title: 'Error en el inicio de sesión',
            text: errorMessage,
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
}
