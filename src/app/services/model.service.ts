import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PredictionResponse } from '../models/PredictionResponse';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ModelService {



  constructor(private http: HttpClient) { }

  predictCareer(features: number[]): Observable<PredictionResponse> {
    return this.http.post<PredictionResponse>(`${environment.apiUrls.modelIA}/aptitudes`, { features });
  }

    predictCareerIntereses(features: number[]): Observable<PredictionResponse> {
    return this.http.post<PredictionResponse>(`${environment.apiUrls.modelIA}/aptitudes`, { features });
  }
}
