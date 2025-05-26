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
}
