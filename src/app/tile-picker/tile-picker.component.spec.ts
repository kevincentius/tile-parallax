import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TilePickerComponent } from './tile-picker.component';

describe('TilePickerComponent', () => {
  let component: TilePickerComponent;
  let fixture: ComponentFixture<TilePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TilePickerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TilePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
