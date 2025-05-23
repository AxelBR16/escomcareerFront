export interface Testimonio {
      nombre: string;
  carrera: string;
  experiencia: string;
  trabajaRelacionada: string;
  puesto?: string;    // Opcional, para cuando trabajaRelacionada sea 'si'
  empresa?: string;   // Opcional
  salario?: number;
  }
  