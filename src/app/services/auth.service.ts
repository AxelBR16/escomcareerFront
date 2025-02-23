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
import { throwError } from 'rxjs'; // ✅ Ahora importado correctamente


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  private token: string | null = this.isBrowser() ? sessionStorage.getItem('token') : null;


constructor(private httpClient: HttpClient) {}

private isBrowser(): boolean {
  return typeof window !== 'undefined';
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


isLoggedIn(): boolean {
  return this.isBrowser() && !!sessionStorage.getItem('token');
}

login(loginData: SignIn): Observable<any> {
    return this.httpClient.post<any>(`${environment.apiUrls.auth}/auth/sign-in`, loginData);
}

registerAspirante(registerData: SignUpAspirante): Observable<ResponseMessageDto> {
    return this.httpClient.post<any>(`${environment.apiUrls.auth}/auth/sign-up`, registerData);
}



signOut(accessToken: string): Observable<any> {
  const headers = new HttpHeaders().set('Authorization', accessToken);
  return this.httpClient.post(`${environment.apiUrls.auth}/auth/sign-out`, null, { headers });
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

storeUserSession(email: string, token: string, role: string): void {
  if (this.isBrowser()) {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('role', role);
    sessionStorage.setItem('email', email);
  }
  this.token = token;
  this.setLoggedIn(true);
}

clearUserSession(): void {
  if (this.isBrowser()) {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('email');

  }
  this.token = null;
  this.setLoggedIn(false);
}



getUserDetails(): Observable<Usuario> {
    let token = localStorage.getItem('token');
    const header = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    });

    return this.httpClient.get<Usuario>(`${environment.apiUrls.auth}/auth/user-details`, { headers: header });
}
}
