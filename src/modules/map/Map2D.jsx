import React, { Component } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as MapActions from "./MapActions";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";

//Component
export class Map2D extends Component {
  constructor(props) {
    super(props);
    this.map = React.createRef();
  }
  static propTypes = {
    crs: PropTypes.object.isRequired,
    center: PropTypes.array.isRequired,
    zoom: PropTypes.number.isRequired,
    layer: PropTypes.object.isRequired
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
        crs={this.props.crs.crs}
        center={this.props.center}
        {...this.props.crs.settings}
        zoom={this.props.zoom}
        onClick={this.clicked.bind(this)}
      >
        <TileLayer
          {...this.props.layer.settings}
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

//Container part
function mapStateToProps(state) {
  //Only map subset of state that map actually requires for rendering
  return {
    center: state.map.center,
    crs: state.map.crs,
    layer: state.map.layer,
    zoom: state.map.zoom
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      ...MapActions
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Map2D);
