import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGstDeclarationComponent } from './view-gst-declaration.component';

describe('ViewGstDeclarationComponent', () => {
  let component: ViewGstDeclarationComponent;
  let fixture: ComponentFixture<ViewGstDeclarationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewGstDeclarationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewGstDeclarationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
