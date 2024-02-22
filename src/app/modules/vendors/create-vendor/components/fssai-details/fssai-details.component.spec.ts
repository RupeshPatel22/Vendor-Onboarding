import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FssaiDetailsComponent } from './fssai-details.component';

describe('FssaiDetailsComponent', () => {
  let component: FssaiDetailsComponent;
  let fixture: ComponentFixture<FssaiDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FssaiDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FssaiDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
