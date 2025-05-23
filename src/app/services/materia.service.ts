import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Materia } from '../models/materia';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MateriaService {


  constructor(private http: HttpClient) { }

  getMateriasPorSemestreYcarrera(semestre: number, carreraId: number): Observable<Materia[]> {
    const params = new HttpParams()
      .set('semestre', semestre.toString())
      .set('carreraId', carreraId.toString());

    return this.http.get<Materia[]>(`${environment.apiUrls.auth}/materias/por-semestre`, { params });
  }
}
