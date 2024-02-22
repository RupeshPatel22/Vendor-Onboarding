import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerLocationDetailsComponent } from './owner-location-details.component';

describe('OwnerLocationDetailsComponent', () => {
  let component: OwnerLocationDetailsComponent;
  let fixture: ComponentFixture<OwnerLocationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OwnerLocationDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerLocationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
