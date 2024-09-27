import { Component, ElementRef, ViewChild } from '@angular/core';
import { FileListComponent } from "../file-list/file-list.component";
import { EditorState, TpFile, TpFileType, TpImageFile } from '../editor-state';

@Component({
  selector: 'app-editor-layout',
  standalone: true,
  imports: [FileListComponent],
  templateUrl: './editor-layout.component.html',
  styleUrl: './editor-layout.component.scss'
})
export class EditorLayoutComponent {
  
  @ViewChild("img") img!: ElementRef<HTMLImageElement>;
  
  TpFileType = TpFileType;

  state: EditorState = {
    files: [],
  };

  onFileClick(file: TpFile) {
    this.state.selectedFile = file;

    if (file.type === TpFileType.IMAGE) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.img.nativeElement.src = e.target!.result as string;
      };
      reader.readAsDataURL((file as TpImageFile).original);
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
    };
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
}
