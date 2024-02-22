import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CongratulationsDialogComponent } from './congratulations-dialog.component';

describe('CongratulationsDialogComponent', () => {
  let component: CongratulationsDialogComponent;
  let fixture: ComponentFixture<CongratulationsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CongratulationsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CongratulationsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
