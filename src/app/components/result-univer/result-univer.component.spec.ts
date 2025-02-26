import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultUniverComponent } from './result-univer.component';

describe('ResultUniverComponent', () => {
  let component: ResultUniverComponent;
  let fixture: ComponentFixture<ResultUniverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultUniverComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultUniverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
