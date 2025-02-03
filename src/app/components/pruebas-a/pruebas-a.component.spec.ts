import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PruebasAComponent } from './pruebas-a.component';

describe('PruebasAComponent', () => {
  let component: PruebasAComponent;
  let fixture: ComponentFixture<PruebasAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PruebasAComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PruebasAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
