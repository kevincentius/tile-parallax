import { ImgSrcProvider } from "tilemap-parallax";
import { TpImageFile } from "./editor-state";

export class EditorImgSrcProvider implements ImgSrcProvider {
  imgMap = new Map<string, string>();

  constructor(
    private imgFiles: TpImageFile[],
  ) {}

  async init() {
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
}
