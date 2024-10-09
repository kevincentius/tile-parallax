import { Component, Input, ViewChild } from '@angular/core';
import { TilePickerComponent } from "../../tile-picker/tile-picker.component";
import { TileMapComponent } from "../../tile-map/tile-map.component";
import { TpFileType, TpImageFile } from '../editor-state';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { defaultGroundConfig, TilesetConfig } from 'tilemap-parallax';

@Component({
  selector: 'app-tile-set-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,

    TilePickerComponent,
    TileMapComponent,
  ],
  templateUrl: './tile-set-editor.component.html',
  styleUrl: './tile-set-editor.component.scss'
})
export class TileSetEditorComponent {
  @Input()
  tilesetConfig!: TilesetConfig;

  @Input()
  files!: TpImageFile[];
  
  @ViewChild("tilePicker") tilePicker!: TilePickerComponent;
  @ViewChild("tileMap") tileMap!: TileMapComponent;

  TpFileType = TpFileType;
  groundConfig = JSON.parse(JSON.stringify(defaultGroundConfig));

  selectedImageFile?: TpImageFile;

  ngOnInit() {
    this.selectedImageFile = this.files.find(f => f.path === this.tilesetConfig.spritesheet.path);
    if (this.selectedImageFile) {
      this.onImageSelect(this.selectedImageFile);
    }
  }

  ngOnChanges(changes?: any) {
    if (changes.tilesetConfig) {
      this.selectedImageFile = this.files.find(file => file.path == this.tilesetConfig.spritesheet.path);
      this.updateImage();
    }
  }
  
  onImageSelect(file: TpImageFile) {
    this.selectedImageFile = file;
    this.tilesetConfig.spritesheet.path = file.path;
    
    this.updateImage();
  }

  private updateImage() {
    const original = this.selectedImageFile!.original!;
    const reader = new FileReader();
    reader.onload = (e) => {
      const imgSrc = e.target!.result as string;
      this.tilePicker.setTilesetImage(imgSrc);
      this.tileMap.setTilesetImage(imgSrc);
    };
    reader.readAsDataURL(original);
  }
}
