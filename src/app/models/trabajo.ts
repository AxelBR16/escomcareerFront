export interface Trabajo {
  id?: number;
  descripcion: string;
  puesto: string;
  salario?: number;
  correoEgresado: string;
  habilidades?: string[];
}
