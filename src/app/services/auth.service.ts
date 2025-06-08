import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedInSubject = new BehaviorSubject<boolean>(false);
  private token: string | null = null;
  private userRoleSubject = new BehaviorSubject<string | null>(null);
  private isNativePlatform: boolean = false;

  constructor(
    private httpClient: HttpClient,
    private platform: Platform
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
      
      console.log(`🔧 Auth inicializada en ${this.isMobile() ? 'móvil' : 'web'}`);
    } catch (error) {
      console.error('❌ Error al inicializar autenticación:', error);
    }
  }

  // MÉTODOS DE ALMACENAMIENTO UNIVERSAL
  // ===================================

  private async setStoredValue(key: string, value: string): Promise<void> {
    try {
      if (this.isMobile()) {
        // ALMACENAMIENTO MÓVIL - Capacitor Preferences
        await Preferences.set({
          key: key,
          value: value,
        });
        console.log(`📱 Guardado en móvil: ${key}`);
      } else {
        // ALMACENAMIENTO WEB - localStorage
        if (this.isBrowser()) {
          localStorage.setItem(key, value);
          console.log(`🌐 Guardado en web: ${key}`);
        }
      }
    } catch (error) {
      console.error(`❌ Error al guardar ${key}:`, error);
      throw error;
    }
  }

  private async getStoredValue(key: string): Promise<string | null> {
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

  private async removeStoredValue(key: string): Promise<void> {
    try {
      if (this.isMobile()) {
        // ELIMINAR DE MÓVIL - Capacitor Preferences
        await Preferences.remove({ key: key });
        console.log(`📱 Eliminado de móvil: ${key}`);
      } else {
        // ELIMINAR DE WEB - localStorage
        if (this.isBrowser()) {
          localStorage.removeItem(key);
          console.log(`🌐 Eliminado de web: ${key}`);
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
          console.log('🌐 Almacenamiento web limpiado');
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
      
      console.log(`✅ Sesión guardada exitosamente en ${this.isMobile() ? 'móvil' : 'web'}`);
      console.log(`🔹 Email: ${email}, Rol: ${role}`);
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
        this.removeStoredValue('loginTimestamp')
      ]);
      
      // Resetear estado interno
      this.userRoleSubject.next(null);
      this.token = null;
      this.setLoggedIn(false);
      
      console.log(`✅ Sesión limpiada exitosamente en ${this.isMobile() ? 'móvil' : 'web'}`);
    } catch (error) {
      console.error('❌ Error al limpiar sesión:', error);
    }
  }

  async isLoggedIn(): Promise<boolean> {
    try {
      const token = await this.getStoredValue('token');
      const isValid = !!token;
      console.log(`🔍 Estado de login: ${isValid ? 'Autenticado' : 'No autenticado'}`);
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
      console.log('✅ Respuestas de usuario guardadas');
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
      console.log('✅ Preferencias de la app guardadas');
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
      
      console.log('📊 Información de almacenamiento:', info);
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
    console.log("📡 Enviando solicitud de registro de egresado:", registerData);

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
      console.log("✅ Respuesta del backend:", response);
      if (response.token && response.role) {
        console.log("🔹 Guardando sesión: Token:", response.token, "Rol:", response.role);
        try {
          await this.storeUserSession(email, response.token, response.role);
        } catch (error) {
          console.error("❌ Error al guardar sesión después del login:", error);
        }
      } else {
        console.warn("⚠️ No se recibió un token o rol en la respuesta.");
      }
    });
  }

  registerAspirante(registerData: SignUpAspirante): Observable<ResponseMessageDto> {
      return this.httpClient.post<any>(`${environment.apiUrls.auth}/auth/sign-up`, registerData);
  }

  async signOut(accessToken?: string): Promise<Observable<any>> {
    try {
      // Si no se proporciona token, obtenerlo del almacenamiento
      const token = accessToken || await this.getCurrentToken();
      
      if (token) {
        const headers = new HttpHeaders().set('Authorization', token);
        const signOutRequest = this.httpClient.post(`${environment.apiUrls.auth}/auth/sign-out`, null, { headers });
        
        // Limpiar sesión local independientemente de la respuesta del servidor
        await this.clearUserSession();
        
        return signOutRequest;
      } else {
        // Si no hay token, solo limpiar sesión local
        await this.clearUserSession();
        return throwError(() => new Error('No hay token de acceso'));
      }
    } catch (error) {
      console.error('❌ Error en signOut:', error);
      // Limpiar sesión local aunque haya error
      await this.clearUserSession();
      return throwError(() => error);
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