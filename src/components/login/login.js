import React, { Component } from 'react';
import { auth, GoogleProvider } from '../firebase';
import './login.css';

class Login extends Component {
    constructor() {
      super();
      this.state = {
        email: '',
        password: '',
        passwordMessage: '',
        emailMessage: '',
        errorMessage: ''
      }
      this.handleChange = this.handleChange.bind(this);
      this.handleEmailSubmit = this.handleEmailSubmit.bind(this);
      this.validatePassword = this.validatePassword.bind(this);
      this.validateEmail = this.validateEmail.bind(this);
      this.handleGoogleSubmit = this.handleGoogleSubmit.bind(this);
    }



    render(){
        return(
            <div className='container'>
                <section className='login'>
                    <h3> Login </h3>
                    <section className='form1'>
                        
                        <form onSubmit={this.handleEmailSubmit}>
                            <p className="errorMessage">{this.state.errorMessage}</p>
                            <input type="email" name="email" placeholder="Email" onChange={this.handleChange} value={this.state.email}/>
                            <p className="errorMessage">{this.state.emailMessage}</p>
                            <input type="password" name="password" placeholder="Password" onChange={this.handleChange} value={this.state.password}/>
                            <p className="errorMessage">{this.state.passwordMessage}</p>
                            <button>Login</button>
                        </form>
                        <button onClick={this.handleGoogleSubmit}>Sign In With Google</button>
                        <button onClick={this.props.changeRegister}>Sign Up</button>
                    </section>
                </section>
            </div>
        );
    }

   handleGoogleSubmit(e) {
        e.preventDefault();
        auth.signInWithPopup(GoogleProvider) 
            .then( (result) => {
            const user = result.user;
            this.props.changeUser(user);
            });
    }

    async handleEmailSubmit(e) {
        e.preventDefault();
        this.setState({errorMessage: ''});
        await this.validateEmail();
        await this.validatePassword();
        if(this.state.emailMessage === '' && this.state.passwordMessage === '') {
            auth.signInWithEmailAndPassword(this.state.email, this.state.password)
            .then((result) => {
                this.props.changeUser(result.user);
            })
            
            .catch(function(error) {
                // Handle Errors here.
                let message = '';
                switch(error.code){
                    case 'auth/user-not-found':
                        message = 'Email / Password Combination Does Not Exist';
                        break;
                    
                    default:
                        message = error.message;
                        break;
                }
                
                this.setState({errorMessage: message});
            }.bind(this));
        }
    }

    async validateEmail(){
        let errors = '';
        if(this.state.email === ''){
            errors = 'Enter An Email Address';
        }
        await this.setState({emailMessage: errors});
    }

    async validatePassword(){
        let errors = '';
        if(this.state.password === ''){
            errors = 'Enter A Password';
        }

        await this.setState({passwordMessage: errors})
    }

    

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    
}

export default Login;