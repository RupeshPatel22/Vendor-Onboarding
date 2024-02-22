import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewPartnerModalComponent } from './add-new-partner-modal.component';

describe('AddNewPartnerModalComponent', () => {
  let component: AddNewPartnerModalComponent;
  let fixture: ComponentFixture<AddNewPartnerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewPartnerModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewPartnerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
