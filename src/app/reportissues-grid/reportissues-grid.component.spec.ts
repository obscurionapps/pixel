import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportissuesGridComponent } from './reportissues-grid.component';

describe('ReportissuesGridComponent', () => {
  let component: ReportissuesGridComponent;
  let fixture: ComponentFixture<ReportissuesGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportissuesGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportissuesGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
