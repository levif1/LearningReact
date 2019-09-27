import React, { Component } from 'react';
import './header.css';

class Header extends Component {
    constructor() {
      super();
      this.state = {
      }
    }

    render(){
        return(
            <header>
              <div>

                {
                  this.props.user ?
                  <div className='wrapper'>
                    <h1>Hello {this.props.user.displayName}</h1>
                    <button onClick={this.props.logout}>Log Out</button>
                  </div>             
                  :
                  <div className='wrapper'>
                    <h1>Contact Book</h1>
                  </div>     
                }
              </div>
            </header>

        );
    }
}

export default Header;