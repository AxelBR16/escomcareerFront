import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResultadoIA } from '../models/ResultadoIA';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResultadoIAService {

   constructor(private http: HttpClient) {}

  guardarResultado(resultado: ResultadoIA): Observable<any> {
    return this.http.post(`${environment.apiUrls.auth}/resultadoIA`, resultado);
  }
}
