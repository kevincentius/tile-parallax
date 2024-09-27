import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroundGenConfigComponent } from './ground-gen-config.component';

describe('ParallaxGenConfigComponent', () => {
  let component: GroundGenConfigComponent;
  let fixture: ComponentFixture<GroundGenConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroundGenConfigComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroundGenConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
