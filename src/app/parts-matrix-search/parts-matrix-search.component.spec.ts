import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartsMatrixSearchComponent } from './parts-matrix-search.component';

describe('PartsMatrixSearchComponent', () => {
  let component: PartsMatrixSearchComponent;
  let fixture: ComponentFixture<PartsMatrixSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartsMatrixSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartsMatrixSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
