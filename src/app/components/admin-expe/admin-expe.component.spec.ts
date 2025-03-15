import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminExpeComponent } from './admin-expe.component';

describe('AdminExpeComponent', () => {
  let component: AdminExpeComponent;
  let fixture: ComponentFixture<AdminExpeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminExpeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminExpeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
