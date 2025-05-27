import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-admin-carreras',
   imports: [CommonModule, RouterModule,IonicModule],
  templateUrl: './admin-carreras.component.html',
  styleUrl: './admin-carreras.component.css'
})
export class AdminCarrerasComponent {
  careers = [
    {
      name: "Ingeniería en Sistemas Computacionales",
      sections: [
        { name: "¿Qué ofrece?", editable: true },
        { name: "Plan de estudios", editable: true }
      ]
    },
    {
      name: "Licenciatura en Ciencia de Datos",
      sections: [
        { name: "¿Qué ofrece?", editable: true },
        { name: "Plan de estudios", editable: true }
      ]
    },
    {
      name: "Ingeniería en Inteligencia Artificial",
      sections: [
        { name: "¿Qué ofrece?", editable: true },
        { name: "Plan de estudios", editable: true }
      ]
    }
  ];

  selectedCareer = this.careers[0];

  // Método para actualizar la tabla cuando se cambia de carrera
  updateTable(event: any) {
    const selectedName = event.target.value;
    this.selectedCareer = this.careers.find(career => career.name === selectedName) || this.careers[0];
  }

  // Método para manejar la edición de una sección
  editSection(section: any) {
    alert(`Editando la sección: ${section.name}`);
  }
}
