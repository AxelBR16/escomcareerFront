import { Injectable } from '@angular/core';
import { proyecto } from '../models/proyecto';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {

   constructor(private http: HttpClient) {}

  guardarProyecto(proyecto: proyecto): Observable<any> {
    return this.http.post(`${environment.apiUrls.auth}/proyectos`, proyecto);
  }

  obtenerProyectosPendientes(email: string): Observable<proyecto[]> {
    return this.http.get<proyecto[]>(`${environment.apiUrls.auth}/proyectos/pendientes?email=${email}`);
  }

  obtenerTodosLosProyectos(email: string): Observable<proyecto[]> {
  return this.http.get<proyecto[]>(`${environment.apiUrls.auth}/proyectos/usuario?email=${email}`);
  }

  eliminarProyecto(id: number): Observable<void> {
  return this.http.delete<void>(`${environment.apiUrls.auth}/proyectos/${id}`);
  }

  obtenerProyectosPorCarrera(carreraId: number): Observable<proyecto[]> {
    return this.http.get<proyecto[]>(`${environment.apiUrls.auth}/proyectos?carreraId=${carreraId}`);
  }

  obtenerProyectosSinAprobar(): Observable<proyecto[]> {
    return this.http.get<proyecto[]>(`${environment.apiUrls.auth}/proyectos/inactivos`);
  }

  aprobarProyecto(id: number): Observable<void> {
    return this.http.put<void>(`${environment.apiUrls.auth}/proyectos/aprobar/${id}`, null);
  }

  rechazarProyecto(id: number): Observable<void> {
    return this.http.put<void>(`${environment.apiUrls.auth}/proyectos/rechazar/${id}`, null);
  }

  votarProyecto(id: number, tipo: 'like' | 'dislike'): Observable<proyecto> {
    return this.http.post<proyecto>(`${environment.apiUrls.auth}/proyectos/${id}/votar?tipo=${tipo}`, {});
  }
}
