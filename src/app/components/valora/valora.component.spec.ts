import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValoraComponent } from './valora.component';

describe('ValoraComponent', () => {
  let component: ValoraComponent;
  let fixture: ComponentFixture<ValoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValoraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
