import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleCarreraComponent } from './detalle-carrera.component';

describe('DetalleCarreraComponent', () => {
  let component: DetalleCarreraComponent;
  let fixture: ComponentFixture<DetalleCarreraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleCarreraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleCarreraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
