import React from 'react';
// eslint-disable-next-line camelcase
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

import { loadScripts } from './scripts';

import './style.css';
import PolygonTooltip from './PolygonTooltip';
import { createButton, addSearchBox, addDrawingTools, addYourLocationButton } from './tools';

/* eslint-disable react/prop-types */
/* global google */
class MapDraw extends React.Component {
  mounted = false;
  /** @type {google.maps.Map} */
  map;
  /** @type {google.maps.InfoWindow} */
  polygonInfoWindow;
  /** @type {google.maps.Polygon[]} */
  polygons = [];
  /** @type {google.maps.drawing.DrawingManager} */
  drawingManager;
  /** @type {Element} */
  drawingButton;

  propsPolygons = this.props.polygons;
  propsSensors = this.props.sensors;

  state = {
    currentPolygon: null,
    polygonIsEditable: false,
  };

  componentDidMount() {
    this.mounted = true;
    const [language, region] = this.props.language.split('-');
    loadScripts(
      `https://maps.googleapis.com/maps/api/js?key=AIzaSyDf1mZyWd07JLjaepr7BPl8kmj3RSMFCIs&libraries=places,drawing&language=${language}&region=${region}`,
      this.mapLoaded,
    );
  }

  componentWillReceiveProps({ polygons }) {
    
    if (polygons !== this.propsPolygons) {
      this.propsPolygons = polygons;
      if (this.map) this.polygonsFromProps(polygons);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  mapLoaded = () => {
    if (!this.mounted) return;
    this.polygonInfoWindow = new google.maps.InfoWindow({
      content: document.createElement('div'),
    });
    this.polygonInfoWindow.addListener('closeclick', () => this.setState({ currentPolygon: null }));

    this.map = new google.maps.Map(this.mapRef, {
      zoom: 4,
      center: { lat: 40, lng: 0 },
      mapTypeId: 'hybrid',
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      gestureHandling: 'greedy',
    });

    // Close polygonInfoWindow on each map click
    this.map.addListener('click', () =>
      this.setState(({ currentPolygon }) => (!currentPolygon ? null : { currentPolygon: this.polygonInfoWindow.close() })),
    );
    this.map.addListener('idle', () => {
      const mapEl = this.map.getDiv().querySelector('.gm-style');
      document.body.classList.toggle(
        'agMap-fullScreen',
        window.innerWidth === mapEl.offsetWidth && window.innerHeight === mapEl.offsetHeight,
      );
    });

    // Initialize the polygons from props, if we have them
    if (this.propsPolygons) this.polygonsFromProps(this.propsPolygons);

    addYourLocationButton(this.map);
    this.addCenterToPolygons();
    addSearchBox(this.map);
    this.drawingManager = new google.maps.drawing.DrawingManager();
    this.drawingButton = addDrawingTools(this.map, this.drawingManager, this.props.editMode, this[`${this.props.editMode}Add`]);
  };

  polygonsFromProps(polygons) {
    polygons.forEach(p =>
      this.polygonAdd(
        new google.maps.Polygon({
          map: this.map,
          paths: p.points.map(({ lat, lng }) => ({ lat: Number(lat), lng: Number(lng) })),
          strokeColor: '#0000FF',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#0000FF',
          fillOpacity: 0.35,
          editable: this.props.editMode === google.maps.drawing.OverlayType.POLYGON,
          geodesic: false,
        }),
        true,
      ),
    );
    this.fitBoundsToPolygons();
  }

  /**
   *
   * @param {google.maps.Polygon} polygon
   * @param [isEdit]
   */
  polygonAdd = (polygon, isEdit) => {
    const path = polygon.getPath();
    google.maps.event.addListener(polygon, 'click', event => {
      this.setState({
        currentPolygon: polygon,
        polygonIsEditable: this.props.editMode === google.maps.drawing.OverlayType.POLYGON,
      });
      this.polygonInfoWindow.setPosition(event.latLng);
      this.polygonInfoWindow.open(this.map, polygon);
    });
    google.maps.event.addListener(path, 'set_at', this.updatePolygons);
    google.maps.event.addListener(path, 'insert_at', this.updatePolygons);
    google.maps.event.addListener(path, 'remove_at', this.updatePolygons);
    this.polygons.push(polygon);
    if (!isEdit) {
      this.updatePolygons();
      this.drawingManager.setDrawingMode(null); // Set the drawingmode back to the default, hand
      this.drawingButton.classList.toggle('polygon', true);
      this.drawingButton.classList.toggle('hand', false);
    }
  };


  fitBoundsToPolygons = () => {
    if (this.polygons.length) {
      const bounds = new google.maps.LatLngBounds();
      this.polygons.forEach(polygon => polygon.getPath().forEach(latlng => bounds.extend(latlng)));
      this.map.fitBounds(bounds);
    }
  };

  addCenterToPolygons() {
    const button = createButton('MapDraw-button MapDraw-buttonCenter');
    button.innerHTML = '[&nbsp;&nbsp;]';
    button.onclick = this.fitBoundsToPolygons;
    this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(button);
  }

  removePolygon = polygon => {
    this.polygons.splice(this.polygons.indexOf(polygon), 1);
    polygon.setMap(null);
    this.updatePolygons();
  };

  removeAllPolygons = () => {
    this.polygons.forEach(polygon => polygon.setMap(null));
    this.polygons = [];
    this.updatePolygons();
  };

  updatePolygons = () => {
    if (!this.props.onChangePolygons) return;
    const area = this.polygons.reduce((acc, p) => acc + google.maps.geometry.spherical.computeArea(p.getPath()), 0) / 10000;
    this.propsPolygons = this.polygons.map(polygon => ({
      points: polygon
        .getPath()
        .getArray()
        .map(p => p.toJSON()),
    }));
    this.props.onChangePolygons(this.propsPolygons, Math.round(area * 1000) / 1000);
  };

  gotMap = r => {
    this.mapRef = r;
  };

  render() {
    const { currentPolygon, polygonIsEditable } = this.state;
    return (
      <div className="MapDraw" style={this.props.style} ref={this.gotMap}>
        {currentPolygon &&
          createPortal(
            <PolygonTooltip
              polygons={this.polygons}
              polygon={currentPolygon}
              editable={polygonIsEditable}
              i18n={this.props.i18n}
              removePolygon={this.removePolygon}
              removeAllPolygons={this.removeAllPolygons}
            />,
            this.polygonInfoWindow.getContent(),
          )}
      </div>
    );
  }
}

MapDraw.propTypes = {
  style: PropTypes.object,
  editMode: PropTypes.oneOf(['polygon']),
  polygons: PropTypes.arrayOf(
    PropTypes.shape({
      points: PropTypes.arrayOf(
        PropTypes.shape({
          lat: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          lng: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        }),
      ),
    }),
  ),
  onChangePolygons: PropTypes.func,
  language: PropTypes.string,
  i18n: PropTypes.object,
};

MapDraw.defaultProps = {
  editMode: 'polygon',
  language: 'en-UK',
};
export default MapDraw;
