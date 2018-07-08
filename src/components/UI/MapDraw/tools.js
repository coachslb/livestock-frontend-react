/* global google */

export function createButton(className) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = className;
  return button;
}

export const addSearchBox = map => {
  const input = document.createElement('input');
  input.className = 'MapDraw-input';

  const searchBox = new google.maps.places.SearchBox(input);
  searchBox.addListener('places_changed', () => {
    const places = searchBox.getPlaces();

    if (places.length === 0) {
      return;
    }

    // For each place, get the icon, name and location.
    const bounds = new google.maps.LatLngBounds();
    places.forEach(place => {
      if (!place.geometry) return;

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
};

// google.maps.drawing.OverlayType.POLYGON
export const addDrawingTools = (map, drawingManager, overlayType, completeCallback) => {
  const drawingOptions = {
    drawingControl: false,
  };
  if (overlayType === google.maps.drawing.OverlayType.POLYGON)
    drawingOptions.polygonOptions = {
      fillColor: '#0500ff',
      strokeColor: '#0500ff',
      editable: true,
      geodesic: true,
    };
  if (overlayType === google.maps.drawing.OverlayType.MARKER)
    drawingOptions.markerOptions = {
      draggable: true,
    };
  drawingManager.setOptions(drawingOptions);
  const button = createButton(`MapDraw-button MapDraw-drawButton ${overlayType}`);

  button.onclick = () => {
    const overlayEditMode = drawingManager.getDrawingMode() !== overlayType;
    button.classList.toggle(overlayType, !overlayEditMode);
    button.classList.toggle('hand', overlayEditMode);
    drawingManager.setDrawingMode(overlayEditMode ? overlayType : null);
  };
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(button);

  google.maps.event.addListener(drawingManager, `${overlayType}complete`, completeCallback);
  drawingManager.setMap(map);
  return button;
};

export const addYourLocationButton = map => {
  const button = createButton('MapDraw-button MapDraw-currentLocationButton');
  google.maps.event.addListener(map, 'center_changed', () => {
    button.classList.toggle('fixed', false);
  });

  button.addEventListener('click', () => {
    button.classList.toggle('loading', true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
          map.setZoom(17);
          button.classList.toggle('loading', false);
          button.classList.toggle('fixed', true);
        },
        () => {
          button.classList.toggle('loading', false);
          button.classList.toggle('error', true);
        },
      );
    } else {
      button.classList.toggle('loading', false);
      button.classList.toggle('error', true);
    }
  });

  button.index = 1;
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(button);
};

// Scripts load
