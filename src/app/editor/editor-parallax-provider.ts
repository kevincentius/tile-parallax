import { ParallaxData, ParallaxProvider, TilesetConfig } from "tilemap-parallax";
import { TpImageFile, TpTilesetFile } from "./editor-state";

/**
 * Files are all preloaded/indexed during init().
 * 
 * It sounds ridiculously lazy but if an image is updated, we simply replace the provider with a new instance.
 */
export class EditorParallaxProvider implements ParallaxProvider {
  imgMap = new Map<string, string>();
  tilesetMap = new Map<string, TilesetConfig>();
  
  constructor(
    private imgFiles: TpImageFile[],
    private tilesetFiles: TpTilesetFile[],
  ) {}

  async init() {
    this.tilesetFiles.forEach(tilesetFile => this.tilesetMap.set(tilesetFile.path, tilesetFile.data));

    const promises = this.imgFiles.map(async imgFile => {
      const original = imgFile.original!;
      const reader = new FileReader();
      reader.readAsDataURL(original);
      
      return new Promise<void>(resolve => {
        reader.onload = e => {
          const imgSrc = e.target!.result as string;
          this.imgMap.set(imgFile.path, imgSrc);
          resolve();
        };
      });
    });
    await Promise.all(promises);
  }

  getSrc(relPath: string): string {
    return this.imgMap.get(relPath)!;
  }

  getTileset(relPath: string): Promise<TilesetConfig> {
    return Promise.resolve(this.tilesetMap.get(relPath)!);
  }

  getParallaxData(id: string): Promise<ParallaxData> {
    throw new Error("Method not implemented.");
  }

}
