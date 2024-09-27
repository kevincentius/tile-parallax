import { TpImageFile } from "./editor-state";

export class EditorImageSrcProvider {
  imgMag = new Map<string, string>();

  constructor(
    private imgFiles: TpImageFile[],
  ) {
    for (const imgFile of imgFiles) {
      this.imgMag.set(imgFile.path, URL.createObjectURL(imgFile.original!));
    }
  }

  getSrc(relPath: string): string {
    return this.imgMag.get(relPath)!;
  }
}
