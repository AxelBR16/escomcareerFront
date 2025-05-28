import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Experiencia } from '../models/experiencia';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Trabajo } from '../models/trabajo';
import { Habilidad } from '../models/habilidad';
import { JobOffer } from '../models/jobOffer';

@Injectable({
  providedIn: 'root'
})
export class ExperienciaService {

  constructor(private http: HttpClient) { }

  guardarExperiencia(experiencia: Experiencia): Observable<any> {
    return this.http.post(`${environment.apiUrls.auth}/experiencias`, experiencia);
  }

  guardarTrabajo(trabajo: Trabajo): Observable<any> {
    return this.http.post(`${environment.apiUrls.auth}/experiencias/trabajo`, trabajo);
  }

  buscarHabilidades(query: string): Observable<Habilidad[]> {
    return this.http.get<Habilidad[]>(`${environment.apiUrls.auth}/experiencias/habilidades?query=${encodeURIComponent(query)}`);
  }
  getExperienciasPorCarrera(carreraId: number): Observable<Experiencia[]> {
    return this.http.get<Experiencia[]>(`${environment.apiUrls.auth}/experiencias/por-carrera/${carreraId}`);
  }
   getTrabajosPorCarrera(carreraId: number): Observable<JobOffer[]> {
    return this.http.get<JobOffer[]>(`${environment.apiUrls.auth}/experiencias/trabajo/${carreraId}`);
  }

 obtenerExperienciasPendientes(): Observable<Experiencia[]> {
    return this.http.get<Experiencia[]>(`${environment.apiUrls.auth}/experiencias/pendientes`);
  }

  aprobarExperiencia(id: number): Observable<void> {
    return this.http.put<void>(`${environment.apiUrls.auth}/experiencias/aprobar/${id}`, {});
  }

  rechazarExperiencia(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrls.auth}/experiencias/rechazar/${id}`);
  }
  }
