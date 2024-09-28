import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { generateTilemap } from '../parallax/parallax-data/tilemap-gen';
import { TilesetConfig } from '../tile-picker/tileset-config';
import { GroundConfig } from '../parallax/parallax-data/ground-gen';

@Component({
  selector: 'app-tile-map',
  standalone: true,
  imports: [],
  templateUrl: './tile-map.component.html',
  styleUrl: './tile-map.component.scss'
})
export class TileMapComponent {
  @Input()
  tilesetConfig!: TilesetConfig;
  
  @Input()
  groundConfig!: GroundConfig;

  @ViewChild("canvas", { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;

  img?: HTMLImageElement;

  setTilesetImage(imgSrc: string) {
    console.log('tilemap imgsrc', imgSrc);
    this.img = new Image();
    this.img.src = imgSrc;
    this.img.onload = () => this.onGenerateClick();
  }
  
  onGenerateClick() {
    if (this.img!.loading) {
      this.generate();
    } else {
      this.img!.onload = () => this.generate();
    }
  }

  generate() {
    const tilemap = generateTilemap(this.tilesetConfig, this.groundConfig);
    const tw = this.tilesetConfig.spritesheet.tileWidth;
    const th = this.tilesetConfig.spritesheet.tileHeight;
    this.canvas.nativeElement.width = tilemap[0].length * tw;
    this.canvas.nativeElement.height = tilemap.length * th;
    
    const ctx = this.canvas.nativeElement.getContext("2d")!;
    ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    tilemap.forEach((row, i) => row.forEach((pos, j) => {
      if (pos === null) return;
      ctx.drawImage(
        this.img!,
        pos.j * tw, pos.i * th, tw, th,
        j * tw, i * th, tw, th,
      );
    }));
  }
}
