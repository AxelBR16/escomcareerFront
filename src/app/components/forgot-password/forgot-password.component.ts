import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ForgotPasswordService } from '../../services/forgot-password.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  imports: [NgIf, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  email: string = '';
  code: string = '';
  newPassword: string = '';
  step = 1; // 1: Enviar código, 2: Ingresar código y nueva contraseña
  message: string = '';

  constructor(private authService: ForgotPasswordService) {}

  async requestCode() {
    try {
      await this.authService.ResetPassword(this.email);
      this.step = 2;
      this.message = 'Código enviado. Verifica tu correo.';
    } catch (error) {
      this.message = 'Error al enviar el código. Intenta nuevamente.';
    }
  }


  async resetPassword() {
    const response = await this.authService.confirmResetPassword(this.email, this.code, this.newPassword);
    if (response) { // ✅ Verificar que response no sea undefined
      this.message = response.message;
      if (response.success) {
        this.step = 1;
      }
    } else {
      this.message = "Ocurrió un error inesperado.";
    }
  }

}
