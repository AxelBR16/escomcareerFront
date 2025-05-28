import { Habilidad } from "./habilidad";

export interface JobOffer {
  id: number;
  descripcion: string;
  puesto: string;
  salario: number;
  habilidades: Habilidad[];
  estado: boolean;
}

