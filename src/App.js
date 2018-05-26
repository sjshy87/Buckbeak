import React, { Component } from 'react';
import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import brands from '@fortawesome/fontawesome-free-brands'
import search from '@fortawesome/fontawesome-free-solid/faSearch'
import rss from '@fortawesome/fontawesome-free-solid/faRss'
import chart from '@fortawesome/fontawesome-free-solid/faChartBar'
import { ReflexContainer, ReflexSplitter, ReflexElement} from 'react-reflex';
import 'react-reflex/styles.css'
import './stylesheets/main.css';

fontawesome.library.add(search, rss, chart, brands)

class App extends Component {
  render() {
    return (
      <div className="outer">
        <div className="banner">Blah</div>
        <div className="top-menu">
          <FontAwesomeIcon icon={['fab', 'phoenix-squadron']} size="2x"/>
        </div>
        <div className="main">
          <div className="left-menu">
            <div className="button">
              <FontAwesomeIcon className="button-icon" icon='search' size="lg"/>
            </div>
            <div className="button">
              <FontAwesomeIcon className="button-icon" icon='rss' size="lg"/>
            </div>
            <div className="button">
              <FontAwesomeIcon className="button-icon" icon='chart-bar' size="lg"/>
            </div>
          </div>
          <div className="content">
          </div>
        </div>
        <div className="banner">Blah</div>
      </div>
    );
  }
}

export default App;
