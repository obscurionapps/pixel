import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridcheckComponent } from './gridcheck.component';

describe('GridcheckComponent', () => {
  let component: GridcheckComponent;
  let fixture: ComponentFixture<GridcheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridcheckComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridcheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
