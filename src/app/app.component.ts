import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TilePickerComponent } from "./tile-picker/tile-picker.component";
import { TileMapComponent } from "./tile-map/tile-map.component";
import { GroundGenConfigComponent } from './ground-gen/ground-gen-config.component';
import { EditorLayoutComponent } from "./editor/editor-layout/editor-layout.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    TilePickerComponent,
    TileMapComponent,
    GroundGenConfigComponent,
    EditorLayoutComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  @HostListener('contextmenu', ['$event'])
  onRightClick(event: MouseEvent) {
    event.preventDefault();
  }
}
