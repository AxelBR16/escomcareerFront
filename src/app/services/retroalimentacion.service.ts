import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RetroalimentacionService {

  constructor(private http: HttpClient) {}

  // Método para guardar la retroalimentación
  saveRetroalimentacion(correo: string,  respuestas: { general: number, experiencias: number, recomendacion: number, sistema: number }): Observable<any> {
    return this.http.post(`${environment.apiUrls.auth}/retroalimentacion/${correo}`, respuestas);
  }

   getAllRetroalimentaciones(): Observable<any> {
    return this.http.get(`${environment.apiUrls.auth}/retroalimentacion`);  // Realiza la solicitud GET al backend
  }
}
