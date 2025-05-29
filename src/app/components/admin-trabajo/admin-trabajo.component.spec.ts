import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTrabajoComponent } from './admin-trabajo.component';

describe('AdminTrabajoComponent', () => {
  let component: AdminTrabajoComponent;
  let fixture: ComponentFixture<AdminTrabajoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTrabajoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminTrabajoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
