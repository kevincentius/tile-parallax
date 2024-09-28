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
  
  changeLayerToImage(layer: ParallaxLayerData) {
    layer.image = this.imageFiles[0].path;
    layer.gen = undefined;
    this.emitChange();
  }

  changeLayerToTilemap(layer: ParallaxLayerData) {
    layer.gen = {
      tileset: this.tilesetFiles[0].data,
      groundGen: {
        amp: 10,
        wl: 10,
        width: 100,
      },
    };
    layer.image = undefined;
    this.emitChange();
  }

  removeLayer(layer: ParallaxLayerData) {
    const idx = this.parallaxData.layers.indexOf(layer);
    this.parallaxData.layers.splice(idx, 1);
    this.emitChange();
  }

  onImageSelect() {
    this.emitChange();
  }

  onTilesetSelect() {
    this.emitChange();
  }

  onLayerChange() {
    this.emitChange();
  }

  addLayer() {
    this.parallaxData.layers.push({
      image: this.imageFiles[0].path,
      mult: 1,
    });
    this.emitChange();
  }

  private emitChange() {
    this.parallaxDataChange.emit(this.parallaxData);
  }
}
