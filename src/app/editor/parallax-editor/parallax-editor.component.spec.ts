import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParallaxEditorComponent } from './parallax-editor.component';

describe('ParallaxEditorComponent', () => {
  let component: ParallaxEditorComponent;
  let fixture: ComponentFixture<ParallaxEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParallaxEditorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParallaxEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
