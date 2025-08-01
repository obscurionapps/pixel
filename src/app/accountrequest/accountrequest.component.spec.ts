import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountrequestComponent } from './accountrequest.component';

describe('AccountrequestComponent', () => {
  let component: AccountrequestComponent;
  let fixture: ComponentFixture<AccountrequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountrequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
