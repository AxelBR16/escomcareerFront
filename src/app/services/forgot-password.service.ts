import { Injectable } from '@angular/core';
import { resetPassword } from 'aws-amplify/auth';
import { confirmResetPassword } from 'aws-amplify/auth';


@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {


  async ResetPassword(username: string) {
    try {
      const output = await resetPassword({ username });
    } catch (error) {
      console.log(error);
    }
  }


  // Paso 2: Confirmar nueva contraseña
  async confirmResetPassword(email: string, code: string, newPassword: string) {
    try {
      await confirmResetPassword({ username: email, confirmationCode: code, newPassword });
      return { success: true, message: 'Contraseña cambiada exitosamente.' };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }
}
