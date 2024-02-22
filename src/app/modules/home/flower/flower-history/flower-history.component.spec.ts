import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowerHistoryComponent } from './flower-history.component';

describe('FlowerHistoryComponent', () => {
  let component: FlowerHistoryComponent;
  let fixture: ComponentFixture<FlowerHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlowerHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowerHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
