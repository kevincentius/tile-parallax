import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ParallaxData, ParallaxLayerData } from '../../parallax/parallax-data/parallax-data';
import { TpImageFile, TpTilesetFile } from '../editor-state';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-parallax-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './parallax-editor.component.html',
  styleUrl: './parallax-editor.component.scss'
})
export class ParallaxEditorComponent {

  @Input()
  parallaxData!: ParallaxData;

  @Input()
  imageFiles!: TpImageFile[];
  
  @Input()
  tilesetFiles!: TpTilesetFile[];

  @Output()
  parallaxDataChange = new EventEmitter<ParallaxData>();
  
  onImageSelect() {
    // layer.image = image;
    console.log("hey");
    this.parallaxDataChange.emit(this.parallaxData);
  }

  onLayerChange() {
    this.parallaxDataChange.emit(this.parallaxData);
  }

  addLayer() {
    this.parallaxData.layers.push({
      image: this.imageFiles[0].path,
      mult: 1,
    });
    this.parallaxDataChange.emit(this.parallaxData);
  }
}
