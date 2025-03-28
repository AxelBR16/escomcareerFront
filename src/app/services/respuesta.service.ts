import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment'; // Si usas entorno

@Injectable({
  providedIn: 'root', // Esto hace que el servicio esté disponible en toda la aplicación
})
export class RespuestaService {
  private apiUrl = `${environment.apiUrls.auth}/respuestas/verificar-respuestas`;

  constructor(private http: HttpClient) {}

  verificarRespuestas(email: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${email}`);
  }
}
