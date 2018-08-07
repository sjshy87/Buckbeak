import React, {Component} from "react";
import CSVReader from "react-csv-reader";

let csvMatrix= [];

const handleFile = csvdata => {
    csvMatrix = csvdata
}

const handleError = data => {
    alert('cannot read file!')
}

export class CSVUpload extends Component {
    render() {
        return (
            <div><table><td>
                            <CSVReader onFileLoaded={handleFile} onError={handleError} />
                        </td>
                        <td>
                            <button onClick={ () => { console.log(csvMatrix) } }>
                                View Data
                            </button>
            </td></table></div>
        );
    }
}


export default CSVUpload;