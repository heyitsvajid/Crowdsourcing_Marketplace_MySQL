//UserDetailsForm.js
import React, { Component } from 'react';
import { FormErrors } from './FormErrors';
import { Link } from 'react-router-dom';
import '../assets/css/custom.css'
import axios from 'axios';
import { withRouter } from 'react-router-dom'

class SignIn extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {},
            email: '',
            password: '',
            formErrors: { email: '', password: '' },
            emailValid: false,
            passwordValid: false,
            formValid: false
        }
    }


    handleUserInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({ [name]: value },
            () => { this.validateField(name, value) });
    }

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let emailValid = this.state.emailValid;
        let passwordValid = this.state.passwordValid;

        switch (fieldName) {
            case 'email':
                emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                fieldValidationErrors.email = emailValid ? '' : ' is invalid';
                break;
            case 'password':
                passwordValid = value.length >= 6;
                fieldValidationErrors.password = passwordValid ? '' : ' is too short';
                break;
            default:
                break;
        }
        this.setState({
            formErrors: fieldValidationErrors,
            emailValid: emailValid,
            passwordValid: passwordValid
        }, this.validateForm);
    }

    validateForm() {
        this.setState({ formValid: this.state.emailValid && this.state.passwordValid });
    }

    errorClass(error) {
        return (error.length === 0 ? '' : 'has-error');
    }
    handleSubmit() {
        let signUpAPI = 'http://localhost:3001/login';
        let email = this.state.email.trim();
        let password = this.state.password;
        if (!email || !password) {
            return;
        }
        var apiPayload = { email: email, password: password };
        axios.post(signUpAPI, apiPayload)
            .then(res => {
                //this.setState({ user: res.data });
                debugger
                this.props.history.push('/home');
            })
            .catch(err => {
                console.error(err);
            });
    }
    render() {
        return (
            <div className="text-center divclasscenter"  >
                <form className="form-signup" method="POST">
                    <img className="mb-4" src="https://cdn6.f-cdn.com/build/icons/fl-logo.svg" alt="" />
                    <h1 className="h3 mb-3 font-weight-normal">Please Sign In</h1>
                    <div>
                        <div className="panel panel-default">
                            <FormErrors formErrors={this.state.formErrors} />
                        </div>
                    </div>

                    <label className="sr-only">Email address</label>
                    <input type="email" name="email" className="form-control" placeholder="Email address" required="" autoFocus=""
                        value={this.state.email} onChange={this.handleUserInput} />
                    <br />                   <label className="sr-only">Password</label>
                    <input type="password" name="password" className="form-control" placeholder="Password" required=""
                        value={this.state.password} onChange={this.handleUserInput} />
                    <div className="checkbox mb-3">
                        <br />       <label>
                            <input type="checkbox" value="remember-me" /> Remember me
        </label>
                    </div>
                    <button className="btn btn-lg btn-primary btn-block" type="button"
                        disabled={!this.state.formValid}
                        onClick={this.handleSubmit.bind(this)}>Log in</button>
                    <p className="mt-5 mb-3 text-muted">© 2017-2018</p>


                    <div>
                        <a href="#" id="forgot-password-btn" className="login-form-forgot forgot-password">Forgot Password?</a>

                    </div>


                    <div className="modal-footer">

                        <span className="login-form-signup-link">
                            Don't have an account?
                        <Link to="/signup"><a href="#" className="switch-to-login">Sign Up</a></Link>
                        </span>

                    </div>
                </form>
            </div>


        )
    }
}

export default withRouter(SignIn);