import { TilesetProvider } from "../parallax/parallax-data/resource-provider";
import { TilesetConfig } from "../tile-picker/tileset-config";
import { TpTilesetFile } from "./editor-state";

export class EditorTilesetProvider implements TilesetProvider {
  tilesetMap = new Map<string, TilesetConfig>();

  constructor(
    private tilesetFiles: TpTilesetFile[],
  ) {
    this.tilesetFiles.forEach(tilesetFile => this.tilesetMap.set(tilesetFile.path, tilesetFile.data));
  }

  getTileset(relPath: string): TilesetConfig {
    console.log(relPath, [...this.tilesetMap.entries()])
    return this.tilesetMap.get(relPath)!;
  }
}
