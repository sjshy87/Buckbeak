import React, { Component } from "react";
//import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import PolarMap from "polarmap";

export default class MapPolar extends Component {
  state = {
    lat: 51.505,
    lng: -0.09,
    zoom: 13
  };

  componentDidMount() {
    this.map = PolarMap(this.node);
  }
  componentDidUpdate() {
    this.resize();
  }
  resize() {
    console.log("Invalidating Size");
    this.map.invalidateSize();
  }

  render() {
    //const position = [this.state.lat, this.state.lng];
    return (
      <div />
      /*
      <Map center={position} zoom={this.state.zoom} ref="map">
        <TileLayer url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png" />
        <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </Map>
      */
    );
  }
}
