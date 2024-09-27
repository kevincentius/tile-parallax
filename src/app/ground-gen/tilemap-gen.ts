import { TilePosType, TilesetConfig } from "../tile-picker/tileset-config";
import { GroundConfig, generateGround } from "./ground-gen";

export function generateTilePosTypeMap(groundCfg: GroundConfig): (TilePosType | null)[][] {
  const ground = generateGround(groundCfg);
  const map = new Array(groundCfg.amp + 1).fill(0)
    .map((_, i) => new Array(ground.length).fill(0)
      .map((_, j) => {
        const groundLevel = ground[j];
        const groundLevelLeft = ground[(j - 1 + ground.length) % ground.length];
        const groundLevelRight = ground[(j + 1) % ground.length];
        const leftIsLower = groundLevelLeft < groundLevel;
        const rightIsLower = groundLevelRight < groundLevel;
        if (i > groundLevel) {
          // sky
          return null;
        } else if (i == groundLevel) {
          // top tile
          return leftIsLower ? TilePosType.TOP_LEFT
            : rightIsLower ? TilePosType.TOP_RIGHT
            : TilePosType.TOP;
        } else if (i == groundLevel - 1) {
          // below top tile
          return leftIsLower ? TilePosType.BELOW_TOP_LEFT
            : rightIsLower ? TilePosType.BELOW_TOP_RIGHT
            : TilePosType.INSIDE;
        } else {
          return TilePosType.INSIDE;
        }
      }));

  // flip vertically
  map.reverse();

  console.log(ground);
  console.log(map);

  return map;
}

export function generateTilemap(tilesetCfg: TilesetConfig, groundCfg: GroundConfig) {
  const tilePickerMap = new Map<TilePosType, { i: number, j: number }[]>();
  tilesetCfg.spritesheet.tiles.forEach((row, i) => {
    row.forEach((tile, j) => {
      tile.posTypes.forEach(posType => {
        const pos = { i, j };
        if (tilePickerMap.has(posType)) {
          tilePickerMap.get(posType)!.push(pos);
        } else {
          tilePickerMap.set(posType, [pos]);
        }
      });
    });
  });

  const typeMap = generateTilePosTypeMap(groundCfg);
  return typeMap.map((row, i) => row.map((type, j) => {
    if (type === null) return null;
    return tilePickerMap.get(type)![Math.floor(Math.random() * tilePickerMap.get(type)!.length)];
  }));
}
