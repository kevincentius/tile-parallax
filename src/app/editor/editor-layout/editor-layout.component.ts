import { Component, ElementRef, ViewChild } from '@angular/core';
import { FileListComponent } from "../file-list/file-list.component";
import { EditorState, TpFile, TpFileType, TpImageFile, TpParallaxFile, TpTilesetFile } from '../editor-state';
import { TileSetEditorComponent } from "../tile-set-editor/tile-set-editor.component";
import { TileMapComponent } from "../../tile-map/tile-map.component";
import { CommonModule } from '@angular/common';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

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

  async importZip(event: Event) {
    const files = [...(event.target as any).files];
    if (files.length === 0) {
      return;
    }

    const zip = await JSZip.loadAsync(files[0]);
    const filesInZip = await Promise.all(
      Object.values(zip.files)
        .filter(file => !file.dir)
        .map(file => {
          return file.async('blob').then(function (fileData) {
            return new File([fileData], file.name);
          });
        }));
    console.log(filesInZip);
    await this.importFiles(filesInZip);
  }

  async importFolder(event: Event) {
    const files = [...(event.target as any).files];
    if (files.length === 0) {
      return;
    }

    await this.importFiles(files);
  }

  private async importFiles(files: File[]) {
    this.state = {
      files: (await Promise.all(files.map(file => this.mapFile(file))))
        .filter(f => !!f) as TpFile[],
      imgFiles: [],
    };
    this.state.imgFiles = this.state.files.filter(f => f.type === TpFileType.IMAGE) as TpImageFile[];
    this.sortFiles();
    this.state.selectedFile = this.state.files[0];
  }

  async mapFile(file: File): Promise<TpFile | undefined> {
    const path = (file.webkitRelativePath == '' ? file.name : file.webkitRelativePath).split('/').slice(1).join('/');
    console.log('Importing file', path);
    if (path.startsWith('image/')) {
      return {
        type: TpFileType.IMAGE,
        path: path,
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
    const zip = new JSZip();

    const imageFolder = zip.folder('image')!;
    this.state.files.filter(f => f.type === TpFileType.IMAGE)
      .forEach(file => imageFolder.file(file.path.split('/').slice(1).join('/'), file.original!));
    
      
    const tilesetFolder = zip.folder('tileset')!;
    this.state.files.filter(f => f.type === TpFileType.TILESET)
      .forEach(file => tilesetFolder.file(file.path.split('/').slice(1).join('/'), JSON.stringify((file as TpTilesetFile).data)));

    const parallaxFolder = zip.folder('parallax')!;
    this.state.files.filter(f => f.type === TpFileType.PARALLAX)
      .forEach(file => parallaxFolder.file(file.path.split('/').slice(1).join('/'), JSON.stringify((file as TpParallaxFile).data)));

    // download zip
    zip.generateAsync({ type: 'blob' }).then(content => saveAs(content, 'export.zip'));
  }

  getCssDisplay(type: TpFileType) { return this.state.selectedFile?.type === type ? 'block' : 'none'; }
  getTilesetData() { return (this.state.selectedFile as TpTilesetFile).data; }
  getParallaxData() { return (this.state.selectedFile as TpParallaxFile).data;}
  
  addTileset() {
    this.state.files.push({
      type: TpFileType.TILESET,
      path: 'tileset/' + this.fileNameInp.nativeElement.value + '.json',
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
    this.sortFiles();
  }

  addParallax() {
    this.state.files.push({
      type: TpFileType.PARALLAX,
      path: 'parallax/' + this.fileNameInp.nativeElement.value + '.json',
      data: {
        id: 'sample',
        layers: [],
      },
    });
    this.sortFiles();
  }

  private sortFiles() {
    this.state.files.sort((a, b) => a.path.localeCompare(b.path));
  }
}
