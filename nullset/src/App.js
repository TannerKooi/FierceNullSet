import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'; 
import {
} from 'reactstrap';
import './App.css';
import HostComVizPage from './Components/HostComVizPage';


class App extends Component {

  constructor(props) {

    super(props);
    this.state = {
      dashboards: ['Dashboard 1', 'Dashboard 2', 'Dashboard 3']
    };
  }

  render(){
    return (
      <div>
        <header> 
          <Navigation />
        </header>
        <SideBar state={this.state} />
      </div>
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
      <div className='nav-bar'>
        <div className='nav-bar-flex'>
        <img className='logo' src="img/logo.jpeg" alt='Logo' width='50px'/>
        <h1 className='logo-text'> SecOpsViz </h1>
        </div>
      </div>
    )
  }
}

class SideBar extends Component {
  render() {
    let dashboard_array = [];
    for (let board of this.props.state.dashboards) {
      dashboard_array.push(
        <div className='sidebar-links' key={board}>
          <img src="img/icon.jpg" alt='Dashboard logo' width='25px' height='25px' className='board-logo' />
          <h2 className='board-header'> {board} </h2>
        </div>
      )
    }
    return (
      <div className='row'> 
        <div className='side-col'>
          {dashboard_array}
        <div className='sidebar-links'>
          <img src="img/dashboard-icon.jpg" />
          Dashboard
        </div>
        <div className='sidebar-links'>
          <Link to="/hostcomvizpage">test</Link>
        </div>
        <div className='body-col'>

        </div>
      </div>
      </div>
    )
  }
}

export default App;
