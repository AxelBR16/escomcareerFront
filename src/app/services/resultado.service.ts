import { HttpClient , HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ResultadoService {

  constructor(private httpClient: HttpClient) { }

  calcularResultado(inventario: string, email: string): Observable<any> {
     return this.httpClient.get(`${environment.apiUrls.auth}/resultados/calcular-resultados/${inventario}`, {
    params: { email },
    responseType: 'text'
    });
  }
}
