import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TileSetEditorComponent } from './tile-set-editor.component';

describe('TileSetEditorComponent', () => {
  let component: TileSetEditorComponent;
  let fixture: ComponentFixture<TileSetEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TileSetEditorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TileSetEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
