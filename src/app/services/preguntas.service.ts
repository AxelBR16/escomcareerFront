import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { Pregunta } from '../models/pregunta';
import { Respuesta } from '../models/respuesta';

@Injectable({
  providedIn: 'root'
})
export class PreguntasService {

  constructor(private httpClient: HttpClient) { }

  getPreguntasAptitudes() {
    return this.httpClient.get<any>(`${environment.apiUrls.auth}/preguntas/inventario/1`);
  }

  getPreguntasIntereses() {
    return this.httpClient.get<any>(`${environment.apiUrls.auth}/preguntas/inventario/2`);
  }

  getPreguntasPreferencias() {
    return this.httpClient.get<any>(`${environment.apiUrls.auth}/preguntas/inventario/3`);
  }

  getPregunta(id: String): Observable<Pregunta>{
    return this.httpClient.get<Pregunta>(`${environment.apiUrls.auth}/preguntas/${id}`);
  }

  obtenerRespuestasUsuario(email: string) {
    return this.httpClient.get<any>(`${environment.apiUrls.auth}/respuestas/obtenerPorAspirante/${email}`);
  }

  saveRespuesta(respuesta: Respuesta): Observable<Respuesta> {
    return this.httpClient.post<Respuesta>(`${environment.apiUrls.auth}/respuestas/guardar`, respuesta);
  }

}
