import React from 'react';
import { compose, withProps, lifecycle } from 'recompose';
import { GoogleMap, withScriptjs, withGoogleMap } from 'react-google-maps';
import { DrawingManager } from 'react-google-maps/lib/components/drawing/DrawingManager';
import SearchBox from 'react-google-maps/lib/components/places/SearchBox';
/* global google */
const MyMapComponent = compose(
  withProps({
    googleMapURL:
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyDf1mZyWd07JLjaepr7BPl8kmj3RSMFCIs&libraries=places,drawing',
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px`, width: '100%' }} />,
    mapElement: <div style={{ height: `100%`, width: '100%' }} />,
  }),
  lifecycle({
    componentWillMount() {
      const refs = {}

      this.setState({
        places: [],
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onPlacesChanged: () => {
          const places = refs.searchBox.getPlaces();
          this.setState({
            places,
            center : {lat:places[0].geometry.location.lat() ,lng:places[0].geometry.location.lng()}
          });
        },
      })
    },
  }),
  withScriptjs,
  withGoogleMap,
)(props => (
  <GoogleMap
    defaultZoom={15}
    defaultCenter={{ lat: -34.397, lng: 150.644 }}
    center={props.center ? props.center : { lat: -34.397, lng: 150.644 }}
    defaultMapTypeId="hybrid"
    defaultOptions={{}}
  >
    <SearchBox
      ref={props.onSearchBoxMounted}
      controlPosition={google.maps.ControlPosition.TOP_LEFT}
      bounds={props.bounds}
      onPlacesChanged={props.onPlacesChanged}
    >
      <input
        type="text"
        placeholder="Localização..."
        style={{
          boxSizing: `border-box`,
          border: `1px solid transparent`,
          width: `240px`,
          height: `32px`,
          marginTop: `27px`,
          padding: `0 12px`,
          borderRadius: `3px`,
          boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
          fontSize: `14px`,
          outline: `none`,
          textOverflow: `ellipses`,
        }}
      />
    </SearchBox>
    {/* <Marker position={{ lat: -34.397, lng: 150.644 }} onClick={props.onMarkerClick} />
    <Polygon
      path={[{ lat: -34.9, lng: 150.64 }, { lat: -34.7, lng: 150.4 }, { lat: -34.3, lng: 150 }]}
    /> */}
    <DrawingManager
      defaultDrawingMode={google.maps.drawing.OverlayType.POLYGON}
      defaultOptions={{
        drawingControl: true,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [google.maps.drawing.OverlayType.POLYGON],
        },
        polygonOptions: {
          fillColor: `#ffff00`,
          strokeColor: `#ffff00`,
          clickable: false,
          editable: true,
          zIndex: 1,
        },
      }}
      onPolygonComplete={p => console.log(p)}
    />
  </GoogleMap>
));

class TerrainPolygon extends React.PureComponent {
  state = {
    isMarkerShown: false,
    center: null,
  };

  componentDidMount() {
    // this.delayedShowMarker()
  }

  // delayedShowMarker = () => {
  //   setTimeout(() => {
  //     this.setState({ isMarkerShown: true })
  //   }, 3000)
  // }

  // handleMarkerClick = () => {
  //   this.setState({ isMarkerShown: false })
  //   this.delayedShowMarker()
  // }

  render() {
    return (
      <MyMapComponent
        center={this.state.center}
        isMarkerShown={this.state.isMarkerShown}
        onMarkerClick={this.handleMarkerClick}
      />
    );
  }
}

export default TerrainPolygon;
