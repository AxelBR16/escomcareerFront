export interface PredictionResponse {
  prediccion: string;
  probabilidades: { [key: string]: number };
}
