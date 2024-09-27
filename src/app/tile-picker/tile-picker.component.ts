import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pos, TilePosType, TilesetConfig } from './tileset-config';
import { TileConfig } from './tile-config';

@Component({
  selector: 'app-tile-picker',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './tile-picker.component.html',
  styleUrl: './tile-picker.component.scss'
})
export class TilePickerComponent {
  @ViewChild("imageElm", { static: true })
  image!: ElementRef<HTMLImageElement>;

  @Output()
  tileClick = new EventEmitter<{ x: number, y: number, button: number }>();

  @Input()
  config!: TilesetConfig;

  scale = 2;

  posTypeRows = [0, 1];
  posTypeCols = [0, 1, 2];

  selectedTile?: Pos;

  ngOnInit() {
    this.image.nativeElement.onload = () => this.onConfigChange();
  }

  // on keydown
  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    // 0-5 sets pos type
    if (this.selectedTile && event.key >= '0' && event.key <= '5') {
      const posType = +event.key;
      const tile = this.config.spritesheet.tiles[this.selectedTile.i][this.selectedTile.j];
      this.addPosType(tile, posType);
    }
  }

  setTilesetImage(imgSrc: string) {
    this.image.nativeElement.src = imgSrc;
  }
  
  onConfigChange() {
    const rows = Math.ceil(this.image.nativeElement.naturalHeight / this.config.spritesheet.tileHeight);
    const cols = Math.ceil(this.image.nativeElement.naturalWidth / this.config.spritesheet.tileWidth);
    
    if (this.config.spritesheet.tiles.length !== rows || this.config.spritesheet.tiles[0].length !== cols) {
      this.config.spritesheet.tiles = new Array(rows).fill(0)
        .map((_, y) => new Array(cols).fill(0)
          .map((_, x) => ({
            posTypes: [],
          })));
    }
  }
  
  onTileClick(i: number, j: number, event: MouseEvent) {
    this.selectedTile = { i, j };
  }

  getPosTypeCellId(row: number, col: number) {
    return row * this.posTypeCols.length + col;
  }

  onPosTypeCellClick(row: number, col: number) {
    if(!this.selectedTile) return;

    const tile = this.config.spritesheet.tiles[this.selectedTile.i][this.selectedTile.j];
    const posType = this.getPosTypeCellId(row, col);

    this.addPosType(tile, posType);
  }

  private addPosType(tile: TileConfig, posType: TilePosType) {
    if (tile.posTypes.includes(posType)) {
      tile.posTypes = tile.posTypes.filter(pt => pt !== posType);
    } else {
      tile.posTypes.push(posType);
      tile.posTypes.sort();
    }
  };

  getSelectedTile() {    
    return this.config.spritesheet.tiles && this.selectedTile ? this.config.spritesheet.tiles[this.selectedTile.i][this.selectedTile.j].posTypes : undefined;
  }
}
