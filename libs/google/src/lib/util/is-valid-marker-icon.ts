export function isValidMarkerIcon(
  marker: unknown,
): marker is string | google.maps.Icon | null | google.maps.Symbol {
  if (marker === null) {
    return true;
  } else if (typeof marker === 'string') {
    return true;
  } else if (typeof marker === 'object' && Object.hasOwn(marker, 'url')) {
    return true;
  } else if (typeof marker === 'object' && Object.hasOwn(marker, 'path')) {
    return true;
  } else {
    return false;
  }
}
