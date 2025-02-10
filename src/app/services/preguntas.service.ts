import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

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

}
