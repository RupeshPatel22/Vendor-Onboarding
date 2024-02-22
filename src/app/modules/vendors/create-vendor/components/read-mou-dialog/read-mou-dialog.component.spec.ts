import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadMouDialogComponent } from './read-mou-dialog.component';

describe('ReadMouDialogComponent', () => {
  let component: ReadMouDialogComponent;
  let fixture: ComponentFixture<ReadMouDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadMouDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadMouDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
