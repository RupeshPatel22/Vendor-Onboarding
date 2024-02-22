import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaanHistoryComponent } from './paan-history.component';

describe('PaanHistoryComponent', () => {
  let component: PaanHistoryComponent;
  let fixture: ComponentFixture<PaanHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaanHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaanHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
