import React, { Component } from "react";
import { connect } from "react-redux";
import fontawesome from "@fortawesome/fontawesome";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import brands from "@fortawesome/fontawesome-free-brands";
import search from "@fortawesome/fontawesome-free-solid/faSearch";
import rss from "@fortawesome/fontawesome-free-solid/faRss";
import chart from "@fortawesome/fontawesome-free-solid/faChartBar";
import { ReflexContainer, ReflexSplitter, ReflexElement } from "react-reflex";
import CollapsibleElement from "./modules/panel/CollapsibleElement";
import ErrorBoundary from "./components/ErrorBoundary";
import Map2D from "./modules/map/Map2D";
import Grid from "./components/Grid";
import "react-reflex/styles.css";
import "./stylesheets/main.css";
import { togglePanel, collapsePanel } from "./modules/panel/PanelActions";
import PropTypes from "prop-types";

fontawesome.library.add(search, rss, chart, brands);

function mapStateToProps(state) {
  return {
    panel: state.panel,
    map: state.map
  };
}
function mapDispatchToProps(dispatch) {
  return {
    toggleLeft: () => dispatch(togglePanel("left")),
    toggleRight: () => dispatch(togglePanel("right")),
    toggleBottom: () => dispatch(togglePanel("bottom")),
    collapseLeft: () => dispatch(collapsePanel("left")),
    collapseRight: () => dispatch(collapsePanel("right")),
    collapseBottom: () => dispatch(collapsePanel("bottom"))
  };
}

class App extends Component {
  onMapResize() {
    console.log("TODO: Resize map");
    //this.map.resize();
  }

  render() {
    return (
      <div className="outer">
        <div className="banner">Blah</div>
        <div className="top-menu">
          <FontAwesomeIcon
            icon={["fab", "phoenix-squadron"]}
            size="2x"
            className="icon-brand"
          />
        </div>
        <div className="main">
          <div className="left-menu">
            <div className="button" onClick={() => this.props.toggleLeft()}>
              <FontAwesomeIcon
                className="button-icon"
                icon="search"
                size="lg"
              />
            </div>
            <div className="button" onClick={() => this.props.toggleRight()}>
              <FontAwesomeIcon className="button-icon" icon="rss" size="lg" />
            </div>
            <div className="button" onClick={() => this.props.toggleBottom()}>
              <FontAwesomeIcon
                className="button-icon"
                icon="chart-bar"
                size="lg"
              />
            </div>
          </div>
          <div className="content">
            <ReflexContainer orientation="vertical">
              {!this.props.panel.left && (
                <CollapsibleElement
                  className="left-pane"
                  onCollapse={() => this.props.collapseLeft()}
                  maxSize={400}
                  threshold={40}
                >
                  Left
                </CollapsibleElement>
              )}
              {!this.props.panel.left && <ReflexSplitter propogate={true} />}
              <ReflexElement>
                <ReflexContainer orientation="horizontal">
                  <ReflexElement
                    minSize={100}
                    className="middle-pane"
                    onResize={this.onMapResize}
                  >
                    <ErrorBoundary>
                      <Map2D ref={this.map} />
                    </ErrorBoundary>
                  </ReflexElement>
                  {!this.props.panel.bottom && (
                    <ReflexSplitter propagate={true} />
                  )}
                  {!this.props.panel.bottom && (
                    <CollapsibleElement
                      className="bottom-pane"
                      onCollapse={() => this.props.collapseBottom()}
                      maxSize={500}
                      threshold={60}
                    >
                      <Grid />
                    </CollapsibleElement>
                  )}
                </ReflexContainer>
              </ReflexElement>
              {!this.props.panel.right && <ReflexSplitter propagate={true} />}
              {!this.props.panel.right && (
                <CollapsibleElement
                  className="right-pane"
                  onCollapse={() => this.props.collapseRight()}
                  maxSize={400}
                  threshold={60}
                >
                  Right
                </CollapsibleElement>
              )}
            </ReflexContainer>
          </div>
        </div>
        <div className="banner">Blah</div>
      </div>
    );
  }
}
App.propTypes = {
  panel: PropTypes.object.isRequired,
  toggleLeft: PropTypes.func.isRequired,
  toggleRight: PropTypes.func.isRequired,
  toggleBottom: PropTypes.func.isRequired,
  collapseLeft: PropTypes.func.isRequired,
  collapseRight: PropTypes.func.isRequired,
  collapseBottom: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
