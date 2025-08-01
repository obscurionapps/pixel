import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewaccountrequestComponent } from './viewaccountrequest.component';

describe('ViewaccountrequestComponent', () => {
  let component: ViewaccountrequestComponent;
  let fixture: ComponentFixture<ViewaccountrequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewaccountrequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewaccountrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
