import React, { Component } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { AgGridReact } from "ag-grid-react";
import { createSelector } from "reselect";
import "ag-grid/dist/styles/ag-grid.css";
import "ag-grid/dist/styles/ag-theme-balham-dark.css";
import "ag-grid/dist/styles/ag-theme-balham.css";

const firstCollection = state => {
  const collections = Object.keys(state.collection.collections);
  return collections.length === 0
    ? []
    : state.collection.collections[collections[0]].data;
};
const getCurrentCollection = createSelector([firstCollection], collection =>
  Object.values(collection)
);

function latestValueGetter(params) {
  const values = params.data.properties[params.colDef.field];
  return values === undefined ? undefined : values[values.length - 1].value;
}
function latitudeGetter(params) {
  if (!params.data.position) return undefined;
  const coords = params.data.position;
  return coords[coords.length - 1].value[1];
}
function longitudeGetter(params) {
  if (!params.data.position) return undefined;
  const coords = params.data.position;
  return coords[coords.length - 1].value[1];
}

export class Grid extends Component {
  static propTypes = {
    /** Data for this grid. Each entry is a row in the grid */
    data: PropTypes.array,
    /** Column definitions for this grid */
    columns: PropTypes.array,
    /** The theme to use */
    theme: PropTypes.string
  };
  static defaultProps = {
    data: [],
    columns: [
      {
        checkboxSelection: true,
        pinned: true,
        suppressMenu: true,
        headerCheckboxSelection: true,
        width: 40,
        suppressResize: true,
        suppressSizeToFit: true
      },
      { headerName: "ID", field: "id", enableCellChangeFlash: true },
      {
        headerName: "Latitude",
        enableCellChangeFlash: true,
        valueGetter: latitudeGetter
      },
      {
        headerName: "Longitude",
        enableCellChangeFlash: true,
        valueGetter: longitudeGetter
      },
      {
        headerName: "Altitude",
        field: "Alt",
        enableCellChangeFlash: true,
        valueGetter: latestValueGetter
      },
      { headerName: "First seen", field: "start", enableCellChangeFlash: true },
      { headerName: "Last seen", field: "end", enableCellChangeFlash: true }
    ],
    theme: "ag-theme-balham-dark"
  };

  render() {
    return (
      <div
        style={{ height: "100%", width: "100%" }}
        className={this.props.theme}
      >
        <AgGridReact
          // binding to array properties
          rowData={this.props.data}
          columnDefs={this.props.columns}
          deltaRowDataMode={true}
          enableSorting={true}
          getRowNodeId={data => data.id}
        />
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    data: getCurrentCollection(state)
    //TODO: columns and theme
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Grid);
