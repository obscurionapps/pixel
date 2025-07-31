import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportissueComponent } from './reportissue.component';

describe('ReportissueComponent', () => {
  let component: ReportissueComponent;
  let fixture: ComponentFixture<ReportissueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportissueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportissueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
