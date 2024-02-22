import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PharmacyHistoryComponent } from './pharmacy-history.component';
describe('PharmacyHistoryComponent', () => {
  let component: PharmacyHistoryComponent;
  let fixture: ComponentFixture<PharmacyHistoryComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PharmacyHistoryComponent]
    })
      .compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacyHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
