import { TileConfig } from "../../tile-picker/tile-config";
import { Pos } from "../../tile-picker/tileset-config";
import { TpImageFile, TpTilesetFile } from "../editor-state";

export class TilesetRemapper {
  constructor(
    private imgFiles: TpImageFile[],
    private tilesets: TpTilesetFile[],
  ) {}

  async remap() {
    for (const imgFile of this.imgFiles) {
      const ssList = this.tilesets
        .map(tileset => tileset.data.spritesheet)
        .filter(ss => ss.path === imgFile.path);
      
      if (ssList.length === 0) {
        continue;
      }

      const ssTiles = ssList.flatMap(ss => ss.tiles.flatMap((row, i) => row.map((tile, j) => ({ ss, i, j, tile }))));
      const usedTiles = [...new Set(ssTiles.filter(t => t.tile.posTypes.length > 0).map(t => ({ i: t.i, j: t.j })))];
      console.log(usedTiles);
      const uniqueUsedTiles = [...new Map(usedTiles.map(t => [`${t.i},${t.j}`, t])).values()];
      console.log(uniqueUsedTiles);

      // recreate tileset with new positions
      const remappingMap = new Map<string, Pos>();
      const canvas = document.createElement('canvas');
      const img = new Image();
      img.src = URL.createObjectURL(imgFile.original!);
      await new Promise<void>(resolve => img.onload = () => resolve());
      
      canvas.width = uniqueUsedTiles.length * ssList[0].tileWidth;
      canvas.height = ssList[0].tileHeight;
      const ctx = canvas.getContext('2d')!;
      uniqueUsedTiles.forEach(({ i, j }, index) => {
        ctx.drawImage(
          img,
          j * ssList[0].tileWidth,
          i * ssList[0].tileHeight,
          ssList[0].tileWidth,
          ssList[0].tileHeight,
          index * ssList[0].tileWidth,
          0,
          ssList[0].tileWidth,
           ssList[0].tileHeight
        );
        
        remappingMap.set(i + ',' + j, { i: 0, j: index });
      });
      console.log([...remappingMap.entries()]);

      // update image
      canvas.toBlob(blob => imgFile.data = blob!);
      
      // update mapping
      ssList.forEach(ss => {
        const newTiles: TileConfig[][] = [
          new Array(uniqueUsedTiles.length).fill(0).map(() => ({ posTypes: [] }))
        ];
        
        ss.tiles.forEach((row, i) => row.forEach((tile, j) => {
          if (tile.posTypes.length === 0) {
            return;
          }

          const newPos = remappingMap.get(i + ',' + j)!;
          console.log(i, j, newPos);
          newTiles[newPos.i][newPos.j] = ss.tiles[i][j];
        }));
        ss.tiles = newTiles;
      });
    }
  }
}
