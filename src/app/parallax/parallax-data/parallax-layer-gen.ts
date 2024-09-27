import { GroundConfig } from "./ground-gen";
import { TilesetConfig } from "../../tile-picker/tileset-config";

export interface ParallaxLayerGenConfig {
  tileset: TilesetConfig;
  groundGen: GroundConfig;
}
