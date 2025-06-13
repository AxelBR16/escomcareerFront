import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { SignIn } from '../models/sign-in';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuario } from '../models/usuario';
import { ResponseMessageDto } from '../models/response-message-dto';
import { SignUpAspirante } from '../models/sign-up-aspirante';
import { ConfirmForgotPassword } from '../models/confirm-forgot-password';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Platform } from '@ionic/angular';

// Importar para móvil
import { Preferences } from '@capacitor/preferences';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedInSubject = new BehaviorSubject<boolean>(false);
  private token: string | null = null;
  private userRoleSubject = new BehaviorSubject<string | null>(null);
  private isNativePlatform: boolean = false;
  private snackBar = inject(MatSnackBar);


  constructor(
    private httpClient: HttpClient,
    private platform: Platform,
    private router: Router
  ) {
    this.isNativePlatform = this.platform.is('capacitor');
    this.initializeAuth();
  }

  // DETECCIÓN DE PLATAFORMA
  // =======================

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && !this.isNativePlatform;
  }

  private isMobile(): boolean {
    return this.isNativePlatform;
  }

  // INICIALIZACIÓN
  // ==============

  private async initializeAuth(): Promise<void> {
    try {
      const token = await this.getStoredValue('token');
      const role = await this.getStoredValue('role');
      
      this.token = token;
      this.userRoleSubject.next(role);
      this.loggedInSubject.next(!!token);
      } catch (error) {
      console.error('❌ Error al inicializar autenticación:', error);
    }
  }

  // MÉTODOS DE ALMACENAMIENTO UNIVERSAL
  // ===================================
  async removePreguntaInicialInv(): Promise<void> {
    try {
      localStorage.removeItem('preguntainicial_inv3');
      localStorage.removeItem('eliminatedOptionsInv3');
      localStorage.removeItem('preguntainicial_inv2');
      localStorage.removeItem('eliminatedOptionsInv2');
      localStorage.removeItem('preguntainicial_inv1');
      localStorage.removeItem('eliminatedOptionsInv1');
      sessionStorage.removeItem('respuestasUsuario_inv3');
      sessionStorage.removeItem('respuestasUsuario_inv1');
      sessionStorage.removeItem('respuestasUsuario_inv2');
      sessionStorage.removeItem('respuestas_inv1');
      sessionStorage.removeItem('respuestas_inv2');
      sessionStorage.removeItem('respuestas_inv3');  
    } catch (error) {
      console.error('❌ Error al eliminar preguntainicial_inv3 de localStorage:', error);
    }
  }

   async setStoredValue(key: string, value: string): Promise<void> {
    try {
      if (this.isMobile()) {
        // ALMACENAMIENTO MÓVIL - Capacitor Preferences
        await Preferences.set({
          key: key,
          value: value,
        });
      } else {
        // ALMACENAMIENTO WEB - localStorage
        if (this.isBrowser()) {
          localStorage.setItem(key, value);
        }
      }
    } catch (error) {
      console.error(`❌ Error al guardar ${key}:`, error);
      throw error;
    }
  }

   async getStoredValue(key: string): Promise<string | null> {
    try {
      if (this.isMobile()) {
        // OBTENER DE MÓVIL - Capacitor Preferences
        const { value } = await Preferences.get({ key: key });
        return value;
      } else {
        // OBTENER DE WEB - localStorage
        if (this.isBrowser()) {
          return localStorage.getItem(key);
        }
        return null;
      }
    } catch (error) {
      console.error(`❌ Error al obtener ${key}:`, error);
      return null;
    }
  }

  async removeStoredValue(key: string): Promise<void> {
    try {
      if (this.isMobile()) {
        // ELIMINAR DE MÓVIL - Capacitor Preferences
        await Preferences.remove({ key: key });
      } else {
        // ELIMINAR DE WEB - localStorage
        if (this.isBrowser()) {
          localStorage.removeItem(key);
        }
      }
    } catch (error) {
      console.error(`❌ Error al eliminar ${key}:`, error);
    }
  }

  private async clearAllStoredValues(): Promise<void> {
    try {
      if (this.isMobile()) {
        // LIMPIAR TODO EN MÓVIL
        await Preferences.clear();
        console.log('📱 Almacenamiento móvil limpiado completamente');
      } else {
        // LIMPIAR KEYS ESPECÍFICAS EN WEB
        if (this.isBrowser()) {
          const keysToRemove = ['token', 'role', 'email', 'respuestasUsuario'];
          keysToRemove.forEach(key => localStorage.removeItem(key));
        }
      }
    } catch (error) {
      console.error('❌ Error al limpiar almacenamiento:', error);
    }
  }

  // MÉTODOS DE SESIÓN DE USUARIO
  // ============================

  async storeUserSession(email: string, token: string, role: string): Promise<void> {
    try {
      // Guardar todos los datos de sesión
      await Promise.all([
        this.setStoredValue('token', token),
        this.setStoredValue('role', role),
        this.setStoredValue('email', email),
        this.setStoredValue('loginTimestamp', new Date().toISOString())
      ]);
      
      // Actualizar estado interno
      this.userRoleSubject.next(role);
      this.token = token;
      this.setLoggedIn(true);

    } catch (error) {
      console.error('❌ Error al guardar sesión:', error);
      throw error;
    }
  }

  async clearUserSession(): Promise<void> {
    try {
      // Eliminar datos específicos de sesión
      await Promise.all([
        this.removeStoredValue('token'),
        this.removeStoredValue('role'),
        this.removeStoredValue('email'),
        this.removeStoredValue('respuestasUsuario'),
        this.removeStoredValue('loginTimestamp'),
        this.removeStoredValue('respuestas_inv1'),
        this.removeStoredValue('respuestas_inv2'),
        this.removeStoredValue('respuestas_inv3'),
        this.removePreguntaInicialInv()
      ]);
      
      // Resetear estado interno
      this.userRoleSubject.next(null);
      this.token = null;
      this.setLoggedIn(false);
      
    } catch (error) {
      console.error('❌ Error al limpiar sesión:', error);
    }
  }

  async isLoggedIn(): Promise<boolean> {
    try {
      const token = await this.getStoredValue('token');
      const isValid = !!token;
      return isValid;
    } catch (error) {
      console.error('❌ Error al verificar estado de login:', error);
      return false;
    }
  }

  async getCurrentUserEmail(): Promise<string | null> {
    return await this.getStoredValue('email');
  }

  async getCurrentUserRole(): Promise<string | null> {
    return await this.getStoredValue('role');
  }

  async getCurrentToken(): Promise<string | null> {
    return await this.getStoredValue('token');
  }

  async getLoginTimestamp(): Promise<Date | null> {
    try {
      const timestamp = await this.getStoredValue('loginTimestamp');
      return timestamp ? new Date(timestamp) : null;
    } catch (error) {
      console.error('❌ Error al obtener timestamp de login:', error);
      return null;
    }
  }

  // MÉTODOS PARA GUARDAR DATOS ADICIONALES DE LA APP
  // ================================================

  async saveUserResponses(responses: any): Promise<void> {
    try {
      const responsesJson = JSON.stringify(responses);
      await this.setStoredValue('respuestasUsuario', responsesJson);
    } catch (error) {
      console.error('❌ Error al guardar respuestas:', error);
    }
  }

  async getUserResponses(): Promise<any | null> {
    try {
      const responsesJson = await this.getStoredValue('respuestasUsuario');
      return responsesJson ? JSON.parse(responsesJson) : null;
    } catch (error) {
      console.error('❌ Error al obtener respuestas:', error);
      return null;
    }
  }

  async saveAppPreferences(preferences: any): Promise<void> {
    try {
      const preferencesJson = JSON.stringify(preferences);
      await this.setStoredValue('appPreferences', preferencesJson);
    } catch (error) {
      console.error('❌ Error al guardar preferencias:', error);
    }
  }

  async getAppPreferences(): Promise<any | null> {
    try {
      const preferencesJson = await this.getStoredValue('appPreferences');
      return preferencesJson ? JSON.parse(preferencesJson) : null;
    } catch (error) {
      console.error('❌ Error al obtener preferencias:', error);
      return null;
    }
  }

  // INFORMACIÓN DE DEPURACIÓN
  // =========================

  async getStorageInfo(): Promise<any> {
    try {
      const info = {
        platform: this.isMobile() ? 'mobile' : 'web',
        isCapacitor: this.isNativePlatform,
        token: await this.getStoredValue('token'),
        role: await this.getStoredValue('role'),
        email: await this.getStoredValue('email'),
        loginTimestamp: await this.getStoredValue('loginTimestamp'),
        hasResponses: !!(await this.getStoredValue('respuestasUsuario')),
        hasPreferences: !!(await this.getStoredValue('appPreferences'))
      };
      
      return info;
    } catch (error) {
      console.error('❌ Error al obtener información de almacenamiento:', error);
      return null;
    }
  }

  // MÉTODOS ORIGINALES DEL SERVICIO (Actualizados)
  // ==============================================

  getUserRole(): Observable<string | null> {
    return this.userRoleSubject.asObservable();
  }

  registerEgresado(registerData: any): Observable<ResponseMessageDto> {

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.httpClient.post<ResponseMessageDto>(`${environment.apiUrls.auth}/auth/sign-up`, registerData, { headers }).pipe(
        catchError(error => {
            console.error("❌ Error en el registro de egresado:", error);
            return throwError(() => new Error(error.error?.message || 'Error al comunicarse con la API.'));
        })
    );
  }

  login(loginData: SignIn): Observable<any> {
    return this.httpClient.post<any>(`${environment.apiUrls.auth}/auth/sign-in`, loginData)
      .pipe(
        catchError(error => {
          console.error("❌ Error en login:", error);
          return throwError(() => new Error(error.error?.message || 'Error en la autenticación.'));
        })
      );
  }

  authenticateUser(email: string, password: string): void {
    this.login({ email, password }).subscribe(async response => {
      if (response.token && response.role) {
        try {
          await this.storeUserSession(email, response.token, response.role);
          await this.setStoredValue('nombre', response.nombre);
        } catch (error) {
          console.error("❌ Error al guardar sesión después del login:", error);
        }
      } else {
        console.warn("⚠️ No se recibió un token o rol en la respuesta.");
      }
    });
  }

  async getCurrentUserName(): Promise<string | null> {
    return await this.getStoredValue('nombre');
  }


  registerAspirante(registerData: SignUpAspirante): Observable<ResponseMessageDto> {
      return this.httpClient.post<any>(`${environment.apiUrls.auth}/auth/sign-up`, registerData);
  }

async signOut(accessToken?: string): Promise<void> {
    const pendingInventories: string[] = [];
    const inventoryNames: string[] = [
      'Inventario de autoevaluación de aptitudes',
      'Inventario de autoevaluación de intereses',
      'Inventario de preferencias universitarias'
    ];

    for (let i = 1; i <= 3; i++) { // Asumimos que hay un máximo de 10 inventarios
      const key = `respuestas_inv${i}`;
      const value = sessionStorage.getItem(key);
      if (value) {
        pendingInventories.push(inventoryNames[i - 1]);
      }
    }

    // Si hay inventarios pendientes, mostrar un SweetAlert
    if (pendingInventories.length > 0) {
      const result = await Swal.fire({
        title: 'Cambios pendientes',
        text: `Hay respuestas pendientes que no se han sincronizado. ¿Quieres sincronizarlas ahora o salir y eliminar los cambios?\n\nInventarios pendientes:\n${pendingInventories.join('\n')}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sincronizar ahora',
        cancelButtonText: 'Eliminar cambios',
      });
      
      if (!result.isConfirmed) {
        await this.clearUserSession();
        await this.removePreguntaInicialInv();
        this.router.navigate(['/login']);
      } else {
        if (navigator.onLine) {
          this.router.navigate(['/cuestionario']);
          const inventariosPendientes = pendingInventories.join(', '); // Unir los inventarios pendientes en un solo string
          this.snackBar.open(`Falta sincronizar las respuestas de: ${inventariosPendientes}`, 'OK', {
            duration: 5000,
            panelClass: ['warning-snackbar']
          });
        } else {
          await Swal.fire({
            title: 'No estás conectado a internet',
            text: 'Por favor, conéctate para sincronizar los cambios.',
            icon: 'error',
            confirmButtonText: 'Cerrar',
          });
        }
      }
    }
}

  forgotPassword(emailData: string): Observable<any> {
    const body = { email: emailData };
    return this.httpClient.post<any>(`${environment.apiUrls.auth}/auth/forgot-password`, body);
  }

  confirmPassword(resetPassword: ConfirmForgotPassword): Observable<any> {
    return this.httpClient.post<any>(`${environment.apiUrls.auth}/auth/confirm-forgotpassword`, resetPassword);
  }

  setLoggedIn(status: boolean): void {
    this.loggedInSubject.next(status);
  }

  getLoggedInStatus(): Observable<boolean> {
    return this.loggedInSubject.asObservable();
  }

  async getUserDetails(): Promise<Observable<Usuario>> {
    try {
      const token = await this.getCurrentToken();
      const header = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });

      return this.httpClient.get<Usuario>(`${environment.apiUrls.auth}/auth/user-details`, { headers: header });
    } catch (error) {
      console.error('❌ Error al obtener detalles de usuario:', error);
      throw error;
    }
  }
}