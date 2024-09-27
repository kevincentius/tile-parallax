import { ParallaxData } from "../parallax/parallax-data/parallax-data";
import { TilesetConfig } from "../tile-picker/tileset-config";

export enum TpFileType {
  IMAGE = 'image',
  TILESET = 'tileset',
  PARALLAX = 'parallax',
}

interface ITpFile {
  type: TpFileType;
  path: string;
  original?: File;
}

export interface TpImageFile extends ITpFile {
  type: TpFileType.IMAGE;
}

export interface TpTilesetFile extends ITpFile {
  type: TpFileType.TILESET;
  data: TilesetConfig;
}

export interface TpParallaxFile extends ITpFile {
  type: TpFileType.PARALLAX;
  data: ParallaxData;
}

export type TpFile = TpImageFile | TpTilesetFile | TpParallaxFile;

export interface EditorState {
  files: TpFile[];
  imgFiles: TpImageFile[]; // files but filtered to only images
  selectedFile?: TpFile;
}
