import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminvideosComponent } from './adminvideos.component';

describe('AdminvideosComponent', () => {
  let component: AdminvideosComponent;
  let fixture: ComponentFixture<AdminvideosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminvideosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminvideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
