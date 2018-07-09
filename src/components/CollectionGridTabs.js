import React from "react";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import classnames from "classnames";
import PropTypes from "prop-types";
import Grid from "./Grid";

export default class CollectionGridTabs extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: "1"
    };
  }
  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }
  render() {
    return (
      <div style={{ display: "flex", "flex-direction": "column" }}>
        <Nav tabs style={{ height: "42px" }}>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === "1" })}
              onClick={() => {
                this.toggle("1");
              }}
            >
              Sample Data
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === "2" })}
              onClick={() => {
                this.toggle("2");
              }}
            >
              Something Else
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab} style={{ flex: "1" }}>
          <TabPane tabId="1" style={{ height: "100%" }}>
            <Grid />
          </TabPane>
          <TabPane tabId="2">boom</TabPane>
        </TabContent>
      </div>
    );
  }
}
