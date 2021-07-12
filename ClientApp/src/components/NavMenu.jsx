import React, { Component } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
//import { faBookOpen } from "@fortawesome/free-solid-svg-icons";

import { faCalculator } from "@fortawesome/free-solid-svg-icons";
import { faSpaceShuttle } from "@fortawesome/free-solid-svg-icons";


import './NavMenu.css';

export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor(props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true
    };
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  render() {
    return (
      <header>
        <Navbar  color="red" className="navbar-expand-sm 
            navbar-toggleable-sm ng-light bg-blue border-bottom box-shadow " >
          <Container>
            <NavbarBrand tag={Link}  to="/">aed_isracart_ahuva</NavbarBrand>
            <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
            <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
              <ul className="navbar-nav flex-grow">
                <NavItem>
                  <NavLink tag={Link}  className="text-dark" to="/">
                    <FontAwesomeIcon color="#0366d6" icon={faHome} size="lg" /> Home
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link}   className="text-dark" to="/calc">
                    <FontAwesomeIcon color="#0366d6" icon={faCalculator} size="lg" /> 
                    &nbsp;Calculator
                  </NavLink>
                </NavItem>
               <NavItem>
                  <NavLink tag={Link}  className="text-dark" to="/swagger">
                    <FontAwesomeIcon color="#0366d6" icon={faSpaceShuttle} size="lg" />
                     &nbsp;Swagger
                  </NavLink>
                </NavItem>
            
          

                {/* <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/counter">Counter</NavLink>
                </NavItem> */}
                {/* <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/fetch-data">Fetch data</NavLink>
                </NavItem> */}
              </ul>
            </Collapse>
          </Container>
        </Navbar>
      </header>
    );
  }
}
