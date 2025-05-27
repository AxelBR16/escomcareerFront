import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PredictionResponse } from '../models/PredictionResponse';

@Injectable({
  providedIn: 'root'
})
export class ModelService {

  private apiUrl = 'https://j4rq1nt78j.execute-api.us-east-2.amazonaws.com/dev';

  constructor(private http: HttpClient) { }

  predictCareer(features: number[]): Observable<PredictionResponse> {
    return this.http.post<PredictionResponse>(this.apiUrl, { features });
  }
}
