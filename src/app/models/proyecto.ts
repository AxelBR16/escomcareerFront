export interface proyecto {
  id?: number;
  nombre: string;
  descripcion: string;
  url: string;
  likes: number;
  dislikes: number;
  egresadoEmail: string;
  materiaId: number;
  estado?: boolean;
  fecha?: string;
  nombreEgresado?: string;
  apellidoEgresado?: string;
  nombreMateria?: string;
}
