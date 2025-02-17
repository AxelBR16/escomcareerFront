import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { Pregunta } from '../models/pregunta';

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

  getPregunta(id: String): Observable<Pregunta>{
    return this.httpClient.get<Pregunta>(`${environment.apiUrls.auth}/preguntas/${id}`);
  }

}
