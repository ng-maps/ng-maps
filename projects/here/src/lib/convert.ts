import { BoundsLiteral } from '@ng-maps/core';

export function boundsFromRect(rect: H.geo.Rect): BoundsLiteral {
  const east = rect.getRight();
  const north = rect.getTop();
  const south = rect.getBottom();
  const west = rect.getLeft();
  return { east, north, south, west };
}
