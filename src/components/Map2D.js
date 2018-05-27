import React, { Component } from "react";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";

export default class Map2D extends Component {
  state = {
    lat: 51.505,
    lng: -0.09,
    zoom: 13
  };

  componentDidUpdate() {
    this.resize();
  }
  resize() {
    console.log("Invalidating Size");
    const map = this.refs.map.leafletElement;
    map.invalidateSize();
  }

  render() {
    const position = [this.state.lat, this.state.lng];
    return (
      <Map center={position} zoom={this.state.zoom} ref="map">
        <TileLayer url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png" />
        <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </Map>
    );
  }
}
