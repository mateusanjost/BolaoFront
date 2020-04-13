import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundgroupsComponent } from './roundgroups.component';

describe('RoundgroupsComponent', () => {
  let component: RoundgroupsComponent;
  let fixture: ComponentFixture<RoundgroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoundgroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundgroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
