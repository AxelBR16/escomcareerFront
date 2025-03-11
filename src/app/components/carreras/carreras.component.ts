import { Component, OnInit } from '@angular/core';
import { CargarScriptsService } from '../../services/cargar-scripts.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carreras',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carreras.component.html',
  styleUrls: ['./carreras.component.css']
})
export class CarrerasComponent implements OnInit {
  images = [
    {
      webp: 'site/isc.webp',
      jpg: "site/isc.jpg",
    },
    {
      webp: 'site/IA.webp',
      jpg: 'site/IA.jpg',
    },
    {
      webp: 'site/CD.webp',
      jpg: 'site/CD.jpg',
    }
  ];


  topics = [
    { title: 'Sistemas Computacionales', description: 'Transforma ideas en tecnología, desarrollando soluciones innovadoras que conectan el mundo digital.' },
    { title: 'Inteligencia Artificial', description: 'Crea sistemas inteligentes que aprenden, evolucionan y revolucionan el futuro de la humanidad.' },
    { title: 'Ciencia de Datos', description: 'Descubre el poder de los datos para entender patrones, anticipar tendencias y tomar decisiones inteligentes.' }
  ];

  loaded: boolean = false;
  imagenesCargadas: number = 0;

  constructor(private _CargarScripts: CargarScriptsService, private router: Router) {}

  ngOnInit() {
    this.mostrarAlertaCarga();
    if (typeof window !== 'undefined') {
      this.cargarImagenes();
    }
  }

  mostrarAlertaCarga() {
    Swal.fire({
      title: 'Cargando imágenes...',
      text: 'Por favor, espera un momento.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  cargarImagenes() {
    Swal.close();

    this.mostrarAlertaCarga();

    this.images.forEach((imagen, index) => {
      let img = new Image();
      img.src = imagen.jpg;

      img.onload = () => {
        this.imagenesCargadas++;
        if (this.imagenesCargadas === this.images.length) {
          this.loaded = true;
          Swal.close();
          if (window.location.pathname === '/carreras') {
            this.cargarScript();
          }
        }
      };
    });
  }

  cargarScript() {
    this._CargarScripts.Carga(["js/carrera.js"]);
  }

  verMas(index: number) {
    this.router.navigate(['/carreras', index]);
  }



}
