import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartMatrixComponent } from './part-matrix.component';

describe('PartMatrixComponent', () => {
  let component: PartMatrixComponent;
  let fixture: ComponentFixture<PartMatrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartMatrixComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
