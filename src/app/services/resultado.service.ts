import { HttpClient , HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { ResultadoResumenDTO } from '../models/ResultadoResumenDTO';


@Injectable({
  providedIn: 'root'
})
export class ResultadoService {

  constructor(private httpClient: HttpClient) { }

//borrar si no se usa 
 private resultados: { etiquetas: string[], puntajes: number[] } = { etiquetas: [], puntajes: [] };

  // Método para guardar los resultados
  setResultados(etiquetas: string[], puntajes: number[]): void {
    this.resultados = { etiquetas, puntajes };
  }

  // Método para obtener los resultados
  getResultados() {
    return this.resultados;
  }



  calcularResultado(inventario: string, email: string): Observable<any> {
     return this.httpClient.get(`${environment.apiUrls.auth}/resultados/calcular-resultados/${inventario}`, {
    params: { email },
    responseType: 'text'
    });
  }

  obtenerResumenPorCorreo(email: string): Observable<ResultadoResumenDTO[]> {
    const params = new HttpParams().set('email', email);
    return this.httpClient.get<ResultadoResumenDTO[]>(`${environment.apiUrls.auth}/resultados`, { params });
  }

  // Método para obtener las similitudes de carrera
  obtenerSimilitudes(email: string): Observable<{ carrera: string, porcentaje: number }[]> {
    return this.httpClient.get<{ carrera: string, porcentaje: number }[]>(`${environment.apiUrls.auth}/similitudes?email=${email}`);
  }

  
  // Función para enviar las características a Lambda y obtener la predicción
  enviarCaracteristicasALambda(puntajes: number[]): Observable<any> {
    // Llama al endpoint de Lambda que hace la predicción
    return this.httpClient.post('https://tu-api-lambda-endpoint/intereses', { features: puntajes });
  }
}
