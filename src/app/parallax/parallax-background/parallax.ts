
export interface ParallaxLayerData {
  image: string;
  mult: number;
  static?: boolean;
}

export interface ParallaxData {
  id: string;
  layers: ParallaxLayerData[];
}

export interface ParallaxLayer {
  data: ParallaxLayerData;
  offset: number;
}
