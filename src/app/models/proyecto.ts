export interface proyecto {
  id?: number;
  nombre: string;
  descripcion: string;
  url: string;
  likes: number;
  dislikes: number;
  egresadoEmail: string;
  carreraId: number;
  materiaId: number;
  validado?: boolean;
  fecha?: string;
}
