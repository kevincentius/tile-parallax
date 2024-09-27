import { ParallaxLayerGenConfig } from "./parallax-layer-gen";

export interface ParallaxLayerData {
  image?: string;                 // for layer with static image
  gen?: ParallaxLayerGenConfig;   // for layer with generated tilemap

  static?: boolean;              // if true, stretch image proportionally to fill the screen
  mult: number;
  disabled?: boolean;
}

export interface ParallaxData {
  id: string;
  layers: ParallaxLayerData[];
}
