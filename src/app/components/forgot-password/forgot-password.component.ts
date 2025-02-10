import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ConfirmForgotPassword } from '../../models/confirm-forgot-password';
import Swal from 'sweetalert2';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [RouterModule,NgIf, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  constructor(private authService: AuthService, private router: Router) {}

  code: string = '';
  email: string = '';
  newPassword: string = '';
  message: string = '';
  step: number = 1;

  requestCode() {
    this.authService.forgotPassword(this.email).subscribe({
      next: (response) => {
        this.step = 2;
        this.message = response;
      },
      error: (error) => {
        const errorMessage = error?.error?.message
        ? error.error.message
        : 'Ocurrió un error desconocido.';

        Swal.fire({
          icon: 'error',
          title: 'Error en el registro',
          text: errorMessage,
          confirmButtonText: 'Aceptar'
        });
      }
  })
}


  resetPassword() {
    const forgotData: ConfirmForgotPassword = {
            email: this.email,
            password: this.newPassword,
            ConfirmationCode: this.code
          };
          this.authService.confirmPassword(forgotData).subscribe({
            next: (response) => {
                Swal.fire({
                icon: 'success',
                title: 'Contraseña actualizada',
                text: 'Tu contraseña ha sido actualizada correctamente',
                confirmButtonText: 'Aceptar'
              });
              this.router.navigate(['/login']);
            },
            error: (error) => {
              const errorMessage = error.error && error.error.message
              ? error.error.message
              : 'Ocurrió un error desconocido.';

              Swal.fire({
                icon: 'error',
                title: 'Error en el registro',
                text: errorMessage,
                confirmButtonText: 'Aceptar'
              });
            }
        })
  }

}
