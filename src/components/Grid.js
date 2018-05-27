import React, { Component } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid/dist/styles/ag-grid.css";
import "ag-grid/dist/styles/ag-theme-balham-dark.css";

export default class RichGridDeclarativeExample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [
        { headerName: "Make", field: "make" },
        { headerName: "Model", field: "model" },
        { headerName: "Price", field: "price" }
      ],
      rowData: [
        { make: "Toyota", model: "Celica", price: 35000 },
        { make: "Ford", model: "Mondeo", price: 32000 },
        { make: "Porsche", model: "Boxter", price: 72000 }
      ]
    };
  }

  render() {
    return (
      <div
        style={{ height: "100%", width: "100%" }}
        className="ag-theme-balham-dark"
      >
        <AgGridReact
          // binding to array properties
          rowData={this.state.rowData}
          columnDefs={this.state.columnDefs}
        />
      </div>
    );
  }
}
