import ReactDOM from "react-dom";
import React from "react";
import { ReflexElement } from "react-reflex";
import PropTypes from "prop-types";

class CollapsibleElement extends React.Component {
  //TODO: Use the threshold parameter to auto-close
  getSize() {
    switch (this.props.orientation) {
      case "horizontal":
        return this.node.offsetHeight;

      case "vertical":
        return this.node.offsetWidth;

      default:
        return 0;
    }
  }

  render() {
    return (
      <ReflexElement {...this.props}>
        <div className="pane-content">{this.props.children}</div>
      </ReflexElement>
    );
  }
}

CollapsibleElement.propTypes = {
  orientation: PropTypes.string.isRequired,
  children: PropTypes.array
};

export default CollapsibleElement;
