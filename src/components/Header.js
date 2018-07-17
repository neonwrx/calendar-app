import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink } from 'reactstrap';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };

    this.toggle = this.toggle.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  handleLogout() {
    localStorage.setItem('email', '');
    localStorage.setItem('password', '');
    // localStorage.clear();
  }

  isAuthenticated() {
    if (this.props.isLoginSuccess) {
      return (
        <Nav className="ml-auto" navbar>
          <NavItem>
            <Link className="nav-link" to="/calendar">Calendar</Link>
          </NavItem>
          <NavItem>
            <NavLink href="" onClick={this.handleLogout}>Logout</NavLink>
          </NavItem>
        </Nav>
      )
    } else {
      return (
        <Nav className="ml-auto" navbar>
          <NavItem>
            <Link className="nav-link" to="/login">Login</Link>
          </NavItem>
        </Nav>
      )
    }
  }

  render() {
    return(
      <div>
        <Navbar color="dark" dark expand="md">
          <NavbarBrand href="/">Calendar App</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            {this.isAuthenticated()}
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

function mapStateToProps({auth}) {
  return {
    isLoginSuccess: auth.isLoginSuccess
  }
}

export default connect(mapStateToProps, {})(Login);
