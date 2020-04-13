import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditTransferComponent } from './credit-transfer.component';

describe('CreditTransferComponent', () => {
  let component: CreditTransferComponent;
  let fixture: ComponentFixture<CreditTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
