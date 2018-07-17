import React, { Component } from 'react';
import { connect } from 'react-redux';
import { login } from '../actions';
import { Container, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import {FormErrors} from './FormErrors';


class Login extends Component {
  componentDidMount() {
    if (this.props.isLoginSuccess) {
      this.props.history.push('/calendar');
    }
  }
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      formErrors: {email: '', password: ''},
      emailValid: false,
      passwordValid: false,
      formValid: false
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isLoginSuccess) {
      this.props.history.push('/calendar');
    }
  }

  handleUserInput (e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({[name]: value},
                  () => { this.validateField(name, value) });
  }

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let emailValid = this.state.emailValid;
    let passwordValid = this.state.passwordValid;

    switch(fieldName) {
      case 'email':
        emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        fieldValidationErrors.email = emailValid ? '' : ' is invalid';
        break;
      case 'password':
        passwordValid = value.length >= 4;
        fieldValidationErrors.password = passwordValid ? '': ' is too short';
        break;
      default:
        break;
    }
    this.setState({formErrors: fieldValidationErrors,
                    emailValid: emailValid,
                    passwordValid: passwordValid
                  }, this.validateForm);
  }

  validateForm() {
    this.setState({formValid: this.state.emailValid && this.state.passwordValid});
  }

  errorClass(error) {
    return(error.length === 0 ? '' : 'is-invalid');
  }

  handleSubmit = event => {
    event.preventDefault();
    let { email, password } = this.state;
    this.props.login(email, password);
    this.setState({
      email: '',
      password: ''
    });
  }

  render() {
    let {isLoginPending, isLoginSuccess, loginError} = this.props;
    return(
      <div style={{maxWidth: '320px', margin: '20px auto 0'}}>
        <Container>
          <FormErrors formErrors={this.state.formErrors} />
          <Form onSubmit={this.handleSubmit}>
            <FormGroup row>
              <Label for="exampleEmail">Email</Label>
              <Input
                className={this.errorClass(this.state.formErrors.email)}
                autoFocus
                type="email"
                name="email"
                id="exampleEmail"
                placeholder="Enter your Email"
                value={this.state.email}
                // onChange={event => this.setState({email: event.target.value})}
                onChange={(event) => this.handleUserInput(event)}
              />
            </FormGroup>
            <FormGroup row>
              <Label for="examplePassword">Password</Label>
              <Input
                className={this.errorClass(this.state.formErrors.password)}
                type="password"
                name="password"
                id="examplePassword"
                autoComplete = "off"
                placeholder="Enter your password"
                value={this.state.password}
                // onChange={event => this.setState({password: event.target.value})}
                onChange={(event) => this.handleUserInput(event)}
              />
            </FormGroup>
            <FormGroup row>
              <Button
                block
                type="submit"
                disabled={!this.state.formValid}
              >
                Submit
              </Button>
            </FormGroup>
              {/* {this.showErrorMsg()} */}
              { isLoginPending && <div>Please wait...</div> }
              { isLoginSuccess && <div>Success.</div> }
              { loginError && <div>{loginError.message}</div> }
          </Form>
        </Container>
      </div>
    );
  }
}

function mapStateToProps({auth}) {
  return {
    isLoginPending: auth.isLoginPending,
    isLoginSuccess: auth.isLoginSuccess,
    loginError: auth.loginError
  };
}

export default connect(mapStateToProps, {login})(Login);
