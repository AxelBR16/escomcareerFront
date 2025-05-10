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

  getPreguntas(id: Number) {
    return this.httpClient.get<any>(`${environment.apiUrls.auth}/preguntas/inventario/${id}`);
  }

  getPregunta(id: String): Observable<Pregunta>{
    return this.httpClient.get<Pregunta>(`${environment.apiUrls.auth}/preguntas/${id}`);
  }

  obtenerRespuestasUsuario(email: string) {
    return this.httpClient.get<any>(`${environment.apiUrls.auth}/respuestas/obtenerPorAspirante/${email}`);
  }

  obtenerRespuestasMasAlta(email: string) {
    return this.httpClient.get<any>(`${environment.apiUrls.auth}/respuestas/obtenerRespuestaConIdMasAlto/${email}`);
  }



  saveRespuesta(respuesta: Respuesta): Observable<Respuesta> {
    return this.httpClient.post<Respuesta>(`${environment.apiUrls.auth}/respuestas/guardar`, respuesta);
  }

}
