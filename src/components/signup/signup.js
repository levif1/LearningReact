import React, { Component } from 'react';
import { auth } from '../firebase';
import './signup.css';

class SignUp extends Component {
    constructor() {
      super();
      this.state = {
        email: '',
        password: '',
        passwordMessage: '',
        emailMessage: '',
        name: ''
      }

      this.handleChange = this.handleChange.bind(this);
      this.handleEmailSignup = this.handleEmailSignup.bind(this);
      this.validatePassword = this.validatePassword.bind(this);
      this.validateEmail = this.validateEmail.bind(this);

       
    }

    render(){
        return(
            <div className='container'>
            <section className='signup'>
                <h3> Sign Up </h3>
                <section className='form2'>
                    
                    <form onSubmit={this.handleEmailSignup}>
                        <p className="errorMessage">{this.state.errorMessage}</p>
                        <input type="text" name="name" placeholder="Name" onChange={this.handleChange} value={this.state.name}/>
                        <input type="email" name="email" placeholder="Email" onChange={this.handleChange} value={this.state.email}/>
                        <p className="errorMessage">{this.state.emailMessage}</p>
                        <input type="password" name="password" placeholder="Password" onChange={this.handleChange} value={this.state.password}/>
                        <p className="errorMessage">{this.state.passwordMessage}</p>
                        <button>Register</button>
                    </form>
                </section>
            </section>
        </div>
        );
    }

    async handleEmailSignup(e){
        e.preventDefault();
        this.setState({errorMessage: ''});
        await this.validateEmail();
        await this.validatePassword();
        if(this.state.emailMessage === '' && this.state.passwordMessage === '') {
           await auth.createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(async (result) => {
                await auth.currentUser.updateProfile({displayName: this.state.name});
                await auth.currentUser.sendEmailVerification();
                this.props.changeRegister();
            })
            
            .catch(function(error) {
                // Handle Errors here.
                let message = '';
                switch(error.code){
                    case 'auth/user-not-found':
                        message = 'Email / Password Combination Does Not Exist';
                        break;
                    case 'auth/email-already-in-use':
                        message = 'The email address is already in use';
                        break;
                    
                    default:
                        message = error.message;
                        break;
                }
                
                this.setState({errorMessage: message});
            }.bind(this));
        }
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
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
        } else if(this.state.password.length <= 6 || this.state.password.length > 15){
            errors = 'Password must be between 6 - 20 characters'
        } else if(this.state.password.length > 20){

        }

        await this.setState({passwordMessage: errors})
    }
}

export default SignUp;