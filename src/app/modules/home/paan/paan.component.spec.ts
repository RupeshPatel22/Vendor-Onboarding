import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaanComponent } from './paan.component';

describe('PaanComponent', () => {
  let component: PaanComponent;
  let fixture: ComponentFixture<PaanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
