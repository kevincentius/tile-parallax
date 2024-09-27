import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TpFile } from '../editor-state';

@Component({
  selector: 'app-file-list',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './file-list.component.html',
  styleUrl: './file-list.component.scss'
})
export class FileListComponent {

  @Output()
  fileClick = new EventEmitter<TpFile>();
  
  @Input()
  files!: TpFile[];

  @Input()
  selectedFile?: TpFile;

  onFileClicked(file: TpFile) {
    this.fileClick.emit(file);
  }
}
