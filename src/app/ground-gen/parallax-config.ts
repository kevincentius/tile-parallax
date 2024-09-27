import { TilesetConfig } from "../tile-picker/tileset-config";
import { GroundConfig } from "./ground-gen";

export interface ParallaxLayerConfig {
  tileset: TilesetConfig;
  groundGen: GroundConfig;
}
