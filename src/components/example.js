class Example extends Component {
    constructor() {
      super();
      this.state = {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        items: [],
        user: null
      }
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.login = this.login.bind(this); 
      this.logout = this.logout.bind(this);
      this.removeItem = this.removeItem.bind(this);
    }
  
    async componentDidMount() {
      const itemsRef = firebase.database().ref('items');
      await itemsRef.on('value', (snapshot) => {
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
        this.setState({
          items: newState
        });
      });
  
      auth.onAuthStateChanged((user) => {
        if (user) {
          this.setState({ user: user });
        } 
      });
    }
  
    render(){
      return (
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
                  <div>Please Login To View Content</div>                
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
  
    handleSubmit(e) {
      e.preventDefault();
      const itemsRef = firebase.database().ref('items');
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
      const itemRef = firebase.database().ref(`/items/${itemId}`);
      itemRef.remove();
    }
  
    handleChange(e) {
      this.setState({
        [e.target.name]: e.target.value
      });
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
  
  export default Example;
  