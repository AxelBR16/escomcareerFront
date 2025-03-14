import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCarrerasComponent } from './admin-carreras.component';

describe('AdminCarrerasComponent', () => {
  let component: AdminCarrerasComponent;
  let fixture: ComponentFixture<AdminCarrerasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCarrerasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCarrerasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
