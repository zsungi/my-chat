import React, { Component } from 'react';
import { Login } from './Login';
import {proxy} from './Proxy';
import {Main} from './Main';

export default class App extends Component
{
  state = { showLogin: true };
  
  componentDidMount()
  {
    proxy.addEventListener( "login", () => this.setState( { showLogin: false } ) );
  }

  render()
  {    
    return (
      <div className="App">
        { this.state.showLogin ? <Login /> : <Main /> }
      </div>
    );
  }
}