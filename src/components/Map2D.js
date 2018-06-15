import React, { Component } from "react";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import PropTypes from "prop-types";

export default class Map2D extends Component {
  constructor(props) {
    super(props);
    this.map = React.createRef();
  }
  static propTypes = {
    settings: PropTypes.object.isRequired
  };
  state = {
    markers: [[51.505, -0.09]]
  };

  componentDidUpdate() {
    this.resize();
  }
  resize() {
    console.log("Invalidating Size");
    const map = this.map.current.leafletElement;
    map.invalidateSize();
  }
  clicked(e) {
    console.log("CLICKED", e.latlng);
    if (this.state === undefined) return;
    const { markers } = this.state;
    markers.push(e.latlng);
    this.setState({ markers });
  }

  render() {
    return (
      <Map
        ref={this.map}
        crs={this.props.settings.crs.crs}
        center={this.props.settings.center}
        {...this.props.settings.crs.settings}
        zoom={this.props.settings.zoom}
        onClick={this.clicked.bind(this)}
      >
        <TileLayer
          {...this.props.settings.layer.settings}
          onTileerror={console.warn}
          onLoading={console.log}
          onLoad={console.log}
        />

        {this.state.markers.map((position, idx) => (
          <Marker key={`marker-${idx}`} position={position}>
            <Popup>
              <span>
                A pretty CSS3 popup. <br /> Easily customizable.
              </span>
            </Popup>
          </Marker>
        ))}
      </Map>
    );
  }
}
