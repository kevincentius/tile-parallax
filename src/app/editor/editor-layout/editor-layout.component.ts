import { Component, ElementRef, ViewChild } from '@angular/core';
import { FileListComponent } from "../file-list/file-list.component";
import { EditorState, TpFile, TpFileType, TpImageFile, TpParallaxFile, TpTilesetFile } from '../editor-state';
import { TileSetEditorComponent } from "../tile-set-editor/tile-set-editor.component";
import { TileMapComponent } from "../../tile-map/tile-map.component";
import { CommonModule } from '@angular/common';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { ParallaxEditorComponent } from '../parallax-editor/parallax-editor.component';
import { EditorImgSrcProvider } from '../editor-image-src-provider';
import { TilesetRemapper } from '../tools/tileset-remapper';
import { EditorTilesetProvider } from '../editor-tileset-provider';
import { ParallaxAnimatorComponent, ParallaxData, ParallaxLayerData, drawTilemap } from 'tilemap-parallax';

@Component({
  selector: 'app-editor-layout',
  standalone: true,
  imports: [
    CommonModule,
    FileListComponent,
    TileMapComponent,
    TileSetEditorComponent,
    ParallaxEditorComponent,
    ParallaxAnimatorComponent,
],
  templateUrl: './editor-layout.component.html',
  styleUrl: './editor-layout.component.scss'
})
export class EditorLayoutComponent {
  
  @ViewChild("img") img!: ElementRef<HTMLImageElement>;
  @ViewChild("fileNameInp") fileNameInp!: ElementRef<HTMLInputElement>;
  @ViewChild("parallaxAnimator") parallaxAnimator!: ParallaxAnimatorComponent;
  
  TpFileType = TpFileType;

  state: EditorState = {
    files: [],
    imgFiles: [],
    tilesetFiles: [],
  };

  imgSrcProvider = new EditorImgSrcProvider(this.state.imgFiles);
  tilesetProvider = new EditorTilesetProvider(this.state.tilesetFiles);

  onFileClick(file: TpFile) {
    this.state.selectedFile = file;

    if (file.type === TpFileType.IMAGE) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.img.nativeElement.src = e.target!.result as string;
      };
      reader.readAsDataURL((file as TpImageFile).original!);
    } else if (file.type === TpFileType.PARALLAX) {
      this.parallaxAnimator.setParallax((file as TpParallaxFile).data);
    }
  }

  onDeleteFileClick(file: TpFile) {
    const idx = this.state.files.indexOf(file);
    this.state.files.splice(idx, 1);
    this.sortFiles();
  }

  onParallaxDataChange(parallaxData: ParallaxData) {
    this.parallaxAnimator.setParallax(parallaxData);
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
      tilesetFiles: [],
    };
    this.sortFiles();
    this.state.selectedFile = this.state.files[0];
    
    this.tilesetProvider = new EditorTilesetProvider(this.state.tilesetFiles);
    this.imgSrcProvider = new EditorImgSrcProvider(this.state.imgFiles);
    await this.imgSrcProvider.init();
  }

  async mapFile(file: File): Promise<TpFile | undefined> {
    const path = (file.webkitRelativePath == '' ? file.name : file.webkitRelativePath).split('/').slice(1).join('/');
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
    const zip = new JSZip()
    const rootFolder = zip.folder('export')!;

    const imageFolder = rootFolder.folder('image')!;
    this.state.files.filter(f => f.type === TpFileType.IMAGE)
      .forEach(file => imageFolder.file(file.path.split('/').slice(1).join('/'), (file as TpImageFile).data ?? file.original!));
    
      
    const tilesetFolder = rootFolder.folder('tileset')!;
    this.state.files.filter(f => f.type === TpFileType.TILESET)
      .forEach(file => tilesetFolder.file(file.path.split('/').slice(1).join('/'), JSON.stringify((file as TpTilesetFile).data)));

    const parallaxFolder = rootFolder.folder('parallax')!;
    this.state.files.filter(f => f.type === TpFileType.PARALLAX)
      .forEach(file => parallaxFolder.file(file.path.split('/').slice(1).join('/'), JSON.stringify((file as TpParallaxFile).data)));

    // download zip
    zip.generateAsync({ type: 'blob' }).then(content => saveAs(content, 'export.zip'));
  }

  getCssDisplay(type: TpFileType) { return this.state.selectedFile?.type === type ? 'block' : 'none'; }
  getTilesetData() { return (this.state.selectedFile as TpTilesetFile).data; }
  getParallaxData() { return (this.state.selectedFile as TpParallaxFile).data;}
  
  async addImage() {
    // prompt file
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      if (input.files!.length === 0) {
        return;
      }

      const file = input.files![0];
      this.state.files.push({
        type: TpFileType.IMAGE,
        path: 'image/' + file.name,
        original: file,
      });

      this.sortFiles();
    };

    input.click();
  }

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

  private async sortFiles() {
    this.state.files.sort((a, b) => a.path.localeCompare(b.path));
    this.state.imgFiles = this.state.files.filter(f => f.type === TpFileType.IMAGE) as TpImageFile[];
    this.state.tilesetFiles = this.state.files.filter(f => f.type === TpFileType.TILESET) as TpTilesetFile[];
    
    this.tilesetProvider = new EditorTilesetProvider(this.state.tilesetFiles);
    this.imgSrcProvider = new EditorImgSrcProvider(this.state.imgFiles);
    await this.imgSrcProvider.init();
  }

  remapTiles() {
    new TilesetRemapper(this.state.imgFiles, this.state.tilesetFiles).remap();
  }
  
  async downloadAsImage(layer: ParallaxLayerData) {
    const canvas = document.createElement('canvas');

    await drawTilemap(
      this.tilesetProvider.getTileset(layer.gen!.tileset),
      layer.gen!.groundGen,
      canvas,
      this.imgSrcProvider.getSrc(this.tilesetProvider.getTileset(layer.gen!.tileset).spritesheet.path),
    );

    canvas.toBlob(blob => {
      saveAs(blob!, 'layer.png');
    });
  }
}
