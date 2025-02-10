import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  constructor() {}

  mostrarCargando(mensaje: string = 'Cargando...') {
    Swal.fire({
      title: mensaje,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  ocultarCargando() {
    Swal.close();
  }
}
