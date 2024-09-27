import { ParallaxLayerGenConfig } from "./parallax-layer-gen";

export interface ParallaxLayerData {
  image?: string;                 // for layer with static image
  gen?: ParallaxLayerGenConfig;   // for layer with generated tilemap

  mult: number;
}

export interface ParallaxData {
  id: string;
  layers: ParallaxLayerData[];
}
