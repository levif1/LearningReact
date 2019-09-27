import React, { Component } from 'react';
import firebase, { auth, GoogleProvider } from './components/firebase';
import './App.css';
import Login from './components/login/login';
import Header from './components/includes/header';
import HomePage from './components/homePage';
import SignUp from './components/signup/signup';

class App extends Component {
  constructor() {
    super();
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      items: [],
      user: null,
      register: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeUser = this.changeUser.bind(this);
    this.login = this.login.bind(this); 
    this.logout = this.logout.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.changeRegister = this.changeRegister.bind(this);

      
      

      auth.onAuthStateChanged((user) => {
        if (user) {
          this.setState({ user: user });
          let userID = firebase.auth().currentUser.uid
          const itemsRef = firebase.database().ref(`/items/${userID}/`);
          //component did mount
          itemsRef.on('value', (snapshot) => {
            let items = snapshot.val();
            let newState = [];
            for (let item in items) {
              newState.push({
                id: item,
                firstName: items[item].first,
                lastName: items[item].last,
                email: items[item].email,
                phoneNumber: items[item].phoneNumber
              });
            }
            this.setState({items: newState});
          });
        }
      });
    }
  


  render(){
    return (
      <div className='app'>
          <Header user={this.state.user} logout={this.logout}></Header>

            {
              !this.state.user ?
                <div className='container'>
                  {!this.state.register ?
                  <Login changeUser={this.changeUser} changeRegister={this.changeRegister}></Login>
                  :
                  <SignUp></SignUp>
                  }     
                </div>
              :
              <div className='container'>
                <section className='add-item'>
                  <form onSubmit={this.handleSubmit}>
                      <input type="text" name="firstName" placeholder="First Name" onChange={this.handleChange} value={this.state.firstName}/>
                      <input type="text" name="lastName" placeholder="Last Name" onChange={this.handleChange} value={this.state.lastName}/>
                      <input type="text" name="email" placeholder="Email" onChange={this.handleChange} value={this.state.email}/>
                      <input type="text" name="phoneNumber" placeholder="Phone Number" onChange={this.handleChange} value={this.state.phoneNumber}/>
                      <button>Add Employee</button>
                    </form>
                </section>

                <section className='display-item'>
                  <div className="wrapper">
                    <ul>
                      {
                        this.state.items.map((item) => {
                          return (
                            <li key={item.id}>
                              <h3>{item.firstName} {item.lastName}</h3>
                              <p>Contact Info: {item.email}</p>
                              <button onClick={() => this.removeItem(item.id)}>Remove Item</button>
                            </li>
                          )
                        })
                      }
                    </ul>
                  </div>
                </section>
              </div>
            }
            
          </div>
    );

  }

  changeUser(user){
    this.setState({user: user});
  }

  handleSubmit(e) {
    e.preventDefault();
    let userID = firebase.auth().currentUser.uid;
    const itemsRef = firebase.database().ref(`/items/${userID}/`);
    const item = {
      first: this.state.firstName,
      last: this.state.lastName,
      email: this.state.email,
      phoneNumber: this.state.phoneNumber
    }
    itemsRef.push(item);
    this.setState({
     firstName: '',
     lastName: '',
     email: '',
     phoneNumber: ''
    });
  }
  
  removeItem(itemId) {
    let userID = firebase.auth().currentUser.uid;
    const itemRef = firebase.database().ref(`/items/${userID}/${itemId}/`);
    itemRef.remove();
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  login(){
    auth.signInWithPopup(GoogleProvider) 
    .then((result) => {
      const user = result.user;
      this.setState({
        user: user
      });
    });
  }

  changeRegister(){
    this.setState({register: !this.state.register});
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
