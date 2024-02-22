import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GstPanDetailsComponent } from './gst-pan-details.component';

describe('GstPanDetailsComponent', () => {
  let component: GstPanDetailsComponent;
  let fixture: ComponentFixture<GstPanDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GstPanDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GstPanDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
