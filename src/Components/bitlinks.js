/* eslint-disable */

import React, { Component } from 'react';
import '../App.css';
import ClickLogo from '../click-icon.svg';

class Bitlinks extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className= "Bitlink">
        {this.props.bitlinkData.map((link) => (
          <div className= "LinkList" key= {link.shortURL}>
            <h4 className = "Title">
              {link.title || link.longURL}
            </h4>
            <p className= "LongURL">
              {link.longURL}
            </p>
            <p className = "ShortURL">
              {link.shortURL}
            </p>
            <p className= "Clicks">
              {link.globalClicks}
              <img className="ClickLogo" src= {ClickLogo}/>
            </p>
            <div className= "Break"></div>
          </div>)
        )}
      </div>
    )
  }
}


export default Bitlinks;