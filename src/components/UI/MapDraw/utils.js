/* eslint-disable import/prefer-default-export */
/**
 * @param {google.map.GeocoderResult[]} results
 * @return {{[detail]: string, [postalCode]: string, [parish]: string, [county]: string, [district]: string, [country]:string}}
 */
export const geoCodeToAddress = results => {
  const address = {};
  for (let ri = 0; ri < results.length; ri += 1) {
    const result = results[ri];
    for (let aci = 0; aci < result.address_components.length; aci += 1) {
      const ac = result.address_components[aci];
      if (!address.detail && ac.types.includes('route')) address.detail = ac.long_name;
      else if (!address.postalCode && ac.types.includes('postal_code')) address.postalCode = ac.long_name;
      else if (!address.parish && ac.types.includes('locality')) address.parish = ac.long_name;
      else if (!address.parish && ac.types.includes('administrative_area_level_3')) address.parish = ac.long_name;
      else if (!address.county && ac.types.includes('administrative_area_level_2')) address.county = ac.long_name;
      else if (!address.district && ac.types.includes('administrative_area_level_1')) address.district = ac.long_name;
      else if (!address.country && ac.types.includes('country')) address.country = ac.long_name;
      if (address.detail && address.postalCode && address.parish && address.county && address.district && address.country) return address;
    }
  }
  return address;
};

/**
 * Convert an array [lat, lng] to object {lat, lng}
 * @param lat
 * @param lng
 * @return {google.maps.LatLngLiteral}
 */
export const arrayToLatLng = ([lat, lng]) => ({ lat, lng });

/**
 *
 * @param {google.maps.LatLngLiteral} ({lat, lng})
 */
export const latLngToArray = ({ lat, lng }) => [lat, lng];
