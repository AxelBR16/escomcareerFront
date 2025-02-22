import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = "https://zr8f0150c8.execute-api.us-east-2.amazonaws.com/Dev";

  constructor(private http: HttpClient) {}

  verifyQr(qrLink: string): Observable<any> {
    console.log("📡 Enviando solicitud a la API con QR:", qrLink);
    return this.http.post<any>(this.apiUrl, { url: qrLink }).pipe(
      catchError(error => {
        console.error("❌ Error en la API:", error);
        return throwError(() => new Error('Error al comunicarse con la API.'));
      })
    );
  }
}
