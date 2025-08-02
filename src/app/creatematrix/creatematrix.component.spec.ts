import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatematrixComponent } from './creatematrix.component';

describe('CreatematrixComponent', () => {
  let component: CreatematrixComponent;
  let fixture: ComponentFixture<CreatematrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatematrixComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatematrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
