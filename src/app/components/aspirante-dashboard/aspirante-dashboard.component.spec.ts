import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AspiranteDashboardComponent } from './aspirante-dashboard.component';

describe('AspiranteDashboardComponent', () => {
  let component: AspiranteDashboardComponent;
  let fixture: ComponentFixture<AspiranteDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AspiranteDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AspiranteDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
