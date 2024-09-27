import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TilePickerComponent } from "./tile-picker/tile-picker.component";
import { TileMapComponent } from "./tile-map/tile-map.component";
import { GroundGenConfigComponent } from './ground-gen/ground-gen-config.component';
import { c } from './hardcoded';
import { defaultGroundConfig } from './parallax/parallax-data/ground-gen';
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
  title = 'tilemap-gen';

  config: any = {
    tileset: {
      spritesheet: {
        path: c.path,
        tileWidth: c.tileSize,
        tileHeight: c.tileSize,
        scale: c.scale,
        tiles: [],
      },
    },

    groundGen: defaultGroundConfig,
  }

  ngOnInit() {
    setTimeout(() => {
      this.config = {"tileset":{"spritesheet":{"path":"aamatniekss-cute/tileset.png","tileWidth":16,"tileHeight":16,"scale":2,"tiles":[[{"posTypes":[0]},{"posTypes":[1]},{"posTypes":[2]},{"posTypes":[3]},{"posTypes":[5]},{"posTypes":[]},{"posTypes":[]},{"posTypes":[]}],[{"posTypes":[]},{"posTypes":[4]},{"posTypes":[]},{"posTypes":[]},{"posTypes":[]},{"posTypes":[]},{"posTypes":[]},{"posTypes":[]}],[{"posTypes":[]},{"posTypes":[]},{"posTypes":[]},{"posTypes":[]},{"posTypes":[]},{"posTypes":[]},{"posTypes":[]},{"posTypes":[]}],[{"posTypes":[]},{"posTypes":[]},{"posTypes":[]},{"posTypes":[]},{"posTypes":[]},{"posTypes":[]},{"posTypes":[]},{"posTypes":[]}],[{"posTypes":[]},{"posTypes":[]},{"posTypes":[]},{"posTypes":[]},{"posTypes":[]},{"posTypes":[]},{"posTypes":[]},{"posTypes":[]}],[{"posTypes":[]},{"posTypes":[]},{"posTypes":[]},{"posTypes":[]},{"posTypes":[]},{"posTypes":[]},{"posTypes":[]},{"posTypes":[]}]]}},"groundGen":{"amp":5,"wl":5,"width":100}};
    });
  }
  
  @HostListener('contextmenu', ['$event'])
  onRightClick(event: MouseEvent) {
    event.preventDefault();
  }
}
