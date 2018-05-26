import React, { Component } from 'react';
import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import brands from '@fortawesome/fontawesome-free-brands'
import search from '@fortawesome/fontawesome-free-solid/faSearch'
import rss from '@fortawesome/fontawesome-free-solid/faRss'
import chart from '@fortawesome/fontawesome-free-solid/faChartBar'
import { ReflexContainer, ReflexSplitter, ReflexElement} from 'react-reflex';
import CollapsibleElement from './components/collapsibleElement';
import Map2D from './components/Map2D';
import Grid from './components/Grid';
import 'react-reflex/styles.css'
import './stylesheets/main.css';

fontawesome.library.add(search, rss, chart, brands)

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
        collapseRight: true,
        collapseLeft: true,
        collapseBottom: false
    }
    this.map = React.createRef();
  } 
  onMapResize() {
      this.refs.map.resize()
  }
  
  toggleLeft () {
    this.collapseLeft(!this.state.collapseLeft)
  }
  toggleRight () {
    this.collapseRight(!this.state.collapseRight)
  }
  toggleBottom () {
    this.collapseBottom(!this.state.collapseBottom)
  }
  collapseLeft (collapseLeft) {
      this.setState({...this.state, collapseLeft})
  }
  collapseRight (collapseRight) {
      this.setState({...this.state, collapseRight})
  }
  collapseBottom (collapseBottom) {
      this.setState({...this.state, collapseBottom})
  }
  render() {
    return (
      <div className="outer">
        <div className="banner">Blah</div>
        <div className="top-menu">
          <FontAwesomeIcon icon={['fab', 'phoenix-squadron']} size="2x" className="icon-brand"/>
        </div>
        <div className="main">
          <div className="left-menu">
            <div className="button" onClick={() => this.toggleLeft()}>
              <FontAwesomeIcon className="button-icon" icon='search' size="lg"/>
            </div>
            <div className="button" onClick={() => this.toggleRight()}>
              <FontAwesomeIcon className="button-icon" icon='rss' size="lg"/>
            </div>
            <div className="button" onClick={() => this.toggleBottom()}>
              <FontAwesomeIcon className="button-icon" icon='chart-bar' size="lg"/>
            </div>
          </div>
          <div className="content">
            <ReflexContainer orientation="vertical">
              {
                  !this.state.collapseLeft &&
                  <CollapsibleElement className="left-pane"
                    onCollapse={() => this.collapseLeft(true)}
                    maxSize={400}
                    threshold={40}>
                    Left
                  </CollapsibleElement>
              }
              {
                  !this.state.collapseLeft &&
                  <ReflexSplitter propogate={true}/>
              }
              <ReflexElement>
                  <ReflexContainer orientation="horizontal">
                    <ReflexElement minSize={100} className="middle-pane" onResize={this.onMapResize}>
                      <Map2D className="map-container" ref={this.map}></Map2D>
                    </ReflexElement>
                    {
                        !this.state.collapseBottom &&
                        <ReflexSplitter propagate={true}/>
                    }
                    {
                     !this.state.collapseBottom &&
                     <CollapsibleElement className="right-pane"
                       onCollapse={() => this.collapseRight(true)}
                       maxSize={500}
                       threshold={60}>
                       <Grid></Grid>
                     </CollapsibleElement>
                    }
                  </ReflexContainer>
              </ReflexElement>
              {
                  !this.state.collapseRight &&
                  <ReflexSplitter propagate={true}/>
              }
              {
               !this.state.collapseRight &&
               <CollapsibleElement className="right-pane"
                 onCollapse={() => this.collapseRight(true)}
                 maxSize={400}
                 threshold={60}>
                Right
               </CollapsibleElement>
              }
            </ReflexContainer>
          </div>
        </div>
        <div className="banner">Blah</div>
      </div>
    );
  }
}

export default App;
