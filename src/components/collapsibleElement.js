import ReactDOM from "react-dom";
import React from "react";
import { ReflexElement } from "react-reflex";

class CollapsibleElement extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (this.props.onCollapse && this.getSize() < this.props.threshold) {
      this.props.onCollapse();
    }
  }

  getSize() {
    const domElement = ReactDOM.findDOMNode(this);

    switch (this.props.orientation) {
      case "horizontal":
        return domElement.offsetHeight;

      case "vertical":
        return domElement.offsetWidth;

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

export default CollapsibleElement;
