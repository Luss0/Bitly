/* eslint-disable */

import React, { Component } from 'react';
import '../reset.css';
import '../App.css';
import BitlySDK from '../util/sdk';
import token from '../util/accessToken';
import logo from '../logo.svg';
import Bitlinks from './bitlinks';
import Loading from './loading';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      isLoading: true,
      isBitlinkLoading: false,
      inputValue: '',
      shortenedURL: '',
      shortSuccess: false,
      linkList: [],
      bitlinkData: [],
      placehold: 'Paste a link to shorten it',
      failState: null
    }
    
    this.accessToken = token;
    
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.shortenURL = this.shortenURL.bind(this);
  }
  
  
  handleChange(event) {
    this.setState({inputValue: event.target.value});
  }

  async handleClick() {
    this.setState({isBitlinkLoading:true});
    await this.shortenURL(this.state.inputValue);
    this.setState({
      isBitlinkLoading:false,
      shortSuccess: true
    });
    this.populateBitlinkData(this.state.linkList);
  }

  async shortenURL(url) {
    let shorty;
    try {
      shorty = await this.state.bitlySDK.shorten(this.state.inputValue)
      let linkList = this.state.linkList;
      this.setState({ 
        shortenedURL: shorty.url,
        linkList: [...linkList, shorty.url],
        failState: null
      })
    } catch(error) {
      console.log(error);
      this.setState({ failState: 'Link Shortening Failed!!'} )
    }
  }

  async populateBitlinkData(list) {
    let bitlinkData = [];
    let bitlinkItem;
    try{
      for (let i = 0; i < list.length; i++) {
        let fullLink = await this.state.bitlySDK.expand(list[i])
        let clickStats = await this.state.bitlySDK.clicks([list[i]])
        let info = await this.state.bitlySDK.info(list[i])
        bitlinkItem = {
          title: info.title,
          longURL: fullLink.long_url,
          globalClicks: clickStats[0].global_clicks,
          shortURL: list[i]
        }
        bitlinkData.push(bitlinkItem);
      }
    } catch(error) {
      console.log(error);
    }
    this.setState({bitlinkData});
  }

  async buildBitlySDK(accessToken) {
    let bitlySDK = await new BitlySDK({
      accessToken: this.accessToken
    });

    this.setState({
      isLoading: false,
      bitlySDK
    });
  }

  componentDidMount(){
    this.buildBitlySDK()
  }

  render() {
    let bitlinkRender;
    if (this.state.bitlinkData.length > 0) {
      if (this.state.isBitlinkLoading) {
        bitlinkRender = <Loading/>
      } else {
        bitlinkRender= <Bitlinks bitlinkData= {this.state.bitlinkData}/>
      }
    }
    if (this.state.isLoading) {
      return <Loading/>
    }
    return (
      <div className="App">
        <nav className= "Navbar">
          <div className="WideDiv">
            <img className="Logo" src= {logo}/>
						<a href="#">TOUR</a>
						<a href="#">ENTERPRISE</a>
						<a href="#">RESOURCES</a>
            <a href="#">ABOUT</a>
					</div>
        </nav>
        <div className= "FailState"> {this.state.failState} </div>
        <p className= "Tagline"> SHORTEN. SHARE. MEASURE.</p>
        <p className= "Subtitle"> Join Bitly, the world's leading link management platform.</p>
          <input type="text" value={this.state.inputValue} onChange={this.handleChange} placeholder= {this.state.placehold}/>
          <button onClick= {this.handleClick} >SHORTEN</button>
        {bitlinkRender}
      </div>
    );
  }
}


export default App;
