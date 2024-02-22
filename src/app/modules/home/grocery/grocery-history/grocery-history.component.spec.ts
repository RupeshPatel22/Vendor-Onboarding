import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GroceryHistoryComponent } from './grocery-history.component';
describe('GroceryHistoryComponent', () => {
  let component: GroceryHistoryComponent;
  let fixture: ComponentFixture<GroceryHistoryComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroceryHistoryComponent]
    })
      .compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(GroceryHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
