import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigIoComponent } from './config-io.component';

describe('ConfigIoComponent', () => {
  let component: ConfigIoComponent;
  let fixture: ComponentFixture<ConfigIoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigIoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfigIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
