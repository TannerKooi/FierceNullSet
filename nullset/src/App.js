import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'; 
import {
  Navbar,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap';
import './App.css';
import HostComVizPage from './Components/HostComVizPage';


class App extends Component {
  render(){
    return (
      <Router>
        <div>
          <Switch>
            <Route exact path='/' children={<Home />} />
            <Route exact path='/hostcomvizpage' children={<HostComVizPage />} />
          </Switch>
        </div>
      </Router>
    )
  }
}

const Home = () => {
  return (
    <div>
      <header> 
        <Navigation />
      </header>
      <SideBar />
    </div>
  )
}

class Navigation extends Component {
  render() {
    return (
      <div>
        <Navbar color="light" light expand="md">
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
        <span className="dot"></span>
        <div className='sidebar-links'>
          <Link to="/hostcomvizpage">test</Link>
        </div>
        </div>
        <div className='body-col'>

        </div>
      </div>
    )
  }
}

export default App;
