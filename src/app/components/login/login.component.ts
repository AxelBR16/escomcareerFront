import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // Importa FormsModule

@Component({
  selector: 'app-login',
  imports: [RouterModule, CommonModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('registerBtn') registerBtn: ElementRef | undefined;
  @ViewChild('signupForm') signupForm: ElementRef | undefined;
  @ViewChild('loginForm') loginForm: ElementRef | undefined;

  // Propiedades para el registro
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';

  // Propiedades para el inicio de sesión
  loginEmail: string = '';
  loginPassword: string = '';

  // Paso actual (1 = Registro, 2 = Verificación)
  currentStep: number = 1;

  ngOnInit(): void {
    // Agregar animación al botón de registro
    if (this.registerBtn) {
      this.registerBtn.nativeElement.addEventListener('click', () => {
        console.log('Animación de transición iniciada');
        if (this.signupForm) {
          this.signupForm.nativeElement.classList.add('hidden');
          this.signupForm.nativeElement.classList.remove('visible');
        }
        if (this.loginForm) {
          this.loginForm.nativeElement.classList.remove('hidden');
          this.loginForm.nativeElement.classList.add('visible');
        }
      });
    }
  }

  // Manejador para el registro
  onRegisterSubmit(event: Event): void {
    event.preventDefault();
    if (this.firstName && this.lastName && this.email && this.password) {
      this.currentStep = 2; // Avanza al siguiente paso
      console.log('Registro completado');
    } else {
      alert('Por favor completa todos los campos');
    }
  }

  // Manejador para el inicio de sesión
  onLoginSubmit(event: Event): void {
    event.preventDefault();
    if (this.loginEmail && this.loginPassword) {
      console.log('Iniciando sesión...');
    } else {
      alert('Por favor ingresa tus credenciales');
    }
  }

  // Función para alternar entre vistas de inicio de sesión y registro
  toggleLogin(): void {
    if (this.signupForm) {
      this.signupForm.nativeElement.classList.add('hidden');
      this.signupForm.nativeElement.classList.remove('visible');
    }
    if (this.loginForm) {
      this.loginForm.nativeElement.classList.remove('hidden');
      this.loginForm.nativeElement.classList.add('visible');
    }
  }
  
  

  toggleRegister(): void {
    if (this.loginForm) {
      this.loginForm.nativeElement.classList.add('hidden');
      this.loginForm.nativeElement.classList.remove('visible');
    }
    if (this.signupForm) {
      this.signupForm.nativeElement.classList.remove('hidden');
      this.signupForm.nativeElement.classList.add('visible');
    }
  }
}
