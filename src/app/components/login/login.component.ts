import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // Referencia al contenedor principal para activar las transiciones
  @ViewChild('contenedor') contenedor!: ElementRef;

  // Campos para el registro (sign-up)
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';

  // Campos para el inicio de sesión (sign-in)
  loginEmail: string = '';
  loginPassword: string = '';

  ngOnInit(): void {
    // Puedes inicializar alguna lógica aquí si es necesario.
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
      // Aquí puedes realizar la lógica de registro y luego mostrar un mensaje de éxito
      Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: '¡Tu cuenta ha sido creada correctamente!',
        confirmButtonText: 'Aceptar'
      });
      console.log('Registro completado');
      // Aquí podrías redireccionar o realizar otra acción.
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
      // Aquí puedes realizar la lógica de inicio de sesión y luego mostrar un mensaje de éxito
      Swal.fire({
        icon: 'success',
        title: 'Inicio de sesión exitoso',
        text: 'Bienvenido de nuevo',
        confirmButtonText: 'Aceptar'
      });
      console.log('Iniciando sesión...');
      // Aquí podrías redireccionar o realizar otra acción.
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
