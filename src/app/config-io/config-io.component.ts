import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ParallaxGenConfig } from '../parallax/parallax-config';

@Component({
  selector: 'app-config-io',
  standalone: true,
  imports: [],
  templateUrl: './config-io.component.html',
  styleUrl: './config-io.component.scss'
})
export class ConfigIoComponent {
  @Input()
  config!: ParallaxGenConfig;

  @Output()
  configChange = new EventEmitter<ParallaxGenConfig>();

  @ViewChild("textAreaElm", { static: true })
  textArea!: ElementRef<HTMLTextAreaElement>;

  onExportClick() {
    this.textArea.nativeElement.value = JSON.stringify(this.config);
  }

  onImportClick() {
    try {
      this.config = JSON.parse(this.textArea.nativeElement.value);
    } catch (e) {
      console.error(e);
    }
    this.configChange.emit(this.config);
  }
}
