import React, { Component } from 'react';
import firebase, { auth, provider } from './components/firebase';
import './App.css';
import HomePage from './components/homePage';

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null
    }

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  render(){
    return(
      <div className='app'>
        <header>
            <div className='wrapper'>
              <h1>Test App</h1>
              {
                this.state.user ?
                <button onClick={this.logout}>Log Out</button>                
                :
                <button onClick={this.login}>Log In</button>              
              }
            </div>
        </header>

          {
            !this.state.user ?
            <HomePage></HomePage>
            :
            <div></div>
          }
      </div>
    );
  }



  login(){
    auth.signInWithPopup(provider) 
    .then((result) => {
      const user = result.user;
      this.setState({
        user: user
      });
    });
  }

  logout() {
    auth.signOut()
      .then(() => {
        this.setState({
          user: null
        });
      });
  }
}

export default App;
