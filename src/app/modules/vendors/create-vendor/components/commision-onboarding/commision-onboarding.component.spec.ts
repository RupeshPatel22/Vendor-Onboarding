import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommisionOnboardingComponent } from './commision-onboarding.component';

describe('CommisionOnboardingComponent', () => {
  let component: CommisionOnboardingComponent;
  let fixture: ComponentFixture<CommisionOnboardingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommisionOnboardingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommisionOnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
