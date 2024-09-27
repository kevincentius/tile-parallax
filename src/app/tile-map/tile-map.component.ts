import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { generateTilemap } from '../parallax/parallax-data/tilemap-gen';
import { Pos } from '../tile-picker/tileset-config';
import { ParallaxLayerGenConfig } from '../parallax/parallax-data/parallax-layer-gen';

@Component({
  selector: 'app-tile-map',
  standalone: true,
  imports: [],
  templateUrl: './tile-map.component.html',
  styleUrl: './tile-map.component.scss'
})
export class TileMapComponent {
  
  @Input()
  config!: ParallaxLayerGenConfig;

  @ViewChild("canvas", { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;

  img!: HTMLImageElement;

  ngOnInit() {
    this.img = new Image();
    this.img.src = 'assets/img/bg/parallax/' + this.config.tileset.spritesheet.path;
    this.img.onload = () => console.log('loaded');
  }
  
  onGenerateClick() {
    const tilemap = generateTilemap(this.config.tileset, this.config.groundGen);
    const tw = this.config.tileset.spritesheet.tileWidth;
    const th = this.config.tileset.spritesheet.tileHeight;
    this.canvas.nativeElement.width = tilemap[0].length * tw;
    this.canvas.nativeElement.height = tilemap.length * th;
    
    const ctx = this.canvas.nativeElement.getContext("2d")!;
    ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    tilemap.forEach((row, i) => row.forEach((pos, j) => {
      if (pos === null) return;
      ctx.drawImage(
        this.img,
        pos.j * tw, pos.i * th, tw, th,
        j * tw, i * th, tw, th,
      );
    }));
  }
}
