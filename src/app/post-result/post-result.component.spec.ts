import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostResultComponent } from './post-result.component';

describe('PostResultComponent', () => {
  let component: PostResultComponent;
  let fixture: ComponentFixture<PostResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
