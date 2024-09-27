import { Component, ElementRef, ViewChild } from '@angular/core';
import { FileListComponent } from "../file-list/file-list.component";
import { EditorState, TpFile, TpFileType, TpImageFile, TpParallaxFile, TpTilesetFile } from '../editor-state';
import { TileSetEditorComponent } from "../tile-set-editor/tile-set-editor.component";
import { TileMapComponent } from "../../tile-map/tile-map.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editor-layout',
  standalone: true,
  imports: [
    CommonModule,
    FileListComponent,
    TileSetEditorComponent,
    TileMapComponent,
    TileSetEditorComponent,
  ],
  templateUrl: './editor-layout.component.html',
  styleUrl: './editor-layout.component.scss'
})
export class EditorLayoutComponent {
  
  @ViewChild("img") img!: ElementRef<HTMLImageElement>;
  @ViewChild("fileNameInp") fileNameInp!: ElementRef<HTMLInputElement>;
  
  TpFileType = TpFileType;

  state: EditorState = {
    files: [],
    imgFiles: [],
  };

  onFileClick(file: TpFile) {
    this.state.selectedFile = file;

    if (file.type === TpFileType.IMAGE) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.img.nativeElement.src = e.target!.result as string;
      };
      reader.readAsDataURL((file as TpImageFile).original!);
    }
  }

  async importFolder(event: Event) {
    const files = [...(event.target as any).files];
    if (files.length === 0) {
      return;
    }

    this.state = {
      files: (await Promise.all(files.map(file => this.mapFile(file))))
        .filter(f => !!f) as TpFile[],
      imgFiles: [],
    };
    this.state.imgFiles = this.state.files.filter(f => f.type === TpFileType.IMAGE) as TpImageFile[];
    this.state.selectedFile = this.state.files[0];
  }

  async mapFile(file: File): Promise<TpFile | undefined> {
    const path = file.webkitRelativePath.split('/').slice(1).join('/');
    if (path.startsWith('image/')) {
      return {
        type: TpFileType.IMAGE,
        path: file.webkitRelativePath,
        original: file,
      };
    } else if (path.startsWith('tileset/')) {
      return {
        type: TpFileType.TILESET,
        path: path,
        original: file,
        data: JSON.parse(await file.text()),
      };
    } else if (path.startsWith('parallax/')) {
      return {
        type: TpFileType.PARALLAX,
        path: path,
        original: file,
        data: JSON.parse(await file.text()),
      };
    } else {
      console.log('Ignored file', path);
      return undefined;
    }
  }

  exportFolder() {
    console.log(this.state);
  }

  getCssDisplay(type: TpFileType) { return this.state.selectedFile?.type === type ? 'block' : 'none'; }
  getTilesetData() { return (this.state.selectedFile as TpTilesetFile).data; }
  getParallaxData() { return (this.state.selectedFile as TpParallaxFile).data;}
  
  addTileset() {
    this.state.files.push({
      type: TpFileType.TILESET,
      path: 'tileset/' + this.fileNameInp.nativeElement.value,
      data: {
        spritesheet: {
          path: 'tileset/sample',
          scale: 1,
          tileWidth: 16,
          tileHeight: 16,
          tiles: [],
        },
      },
    });
  }

  addParallax() {
    this.state.files.push({
      type: TpFileType.PARALLAX,
      path: 'parallax/' + this.fileNameInp.nativeElement.value,
      data: {
        id: 'sample',
        layers: [],
      },
    });
  }
}
