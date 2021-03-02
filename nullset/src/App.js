import React, { Component } from 'react';
import {
  Navbar,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap';
import './App.css';


class App extends Component {
  render(){
    return (
      <div>
        <header> 
          <Navigation />
        </header>
        <SideBar />
      </div>
    )
  }
}

class Navigation extends Component {
  render() {
    return (
      <div class='nav-bar'>
        <Navbar expand="md">
          <Nav className='mr-auto'>
            <NavItem>
              <NavLink href='/' className='navlink'> File </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href='/' className='navlink'> Data </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href='/' className='navlink'> Analysis </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href='/' className='navlink'> Window </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href='/' className='navlink'> Help </NavLink>
            </NavItem>
          </Nav>
        </Navbar>
      </div>
    )
  }
}

class SideBar extends Component {
  render() {
    return (
      <div className='row'> 
        <div className='side-col'>
        <div className='sidebar-links'>
          <img src="img/dashboard-icon.jpg"/>
          Dashboard
        </div>
        </div>
        <div className='body-col'>

        </div>
      </div>
    )
  }
}

export default App;
