import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'; 
import {
} from 'reactstrap';
import './App.css';
import HostComVizPage from './Components/HostComVizPage';
import DevDestress from './Components/DevDestress';


class App extends Component {

  constructor(props) {

    super(props);
    this.state = {
      dashboards: ['Dashboard 1', 'Dashboard 2', 'Dashboard 3']
    };
  }

  render(){
    return (
      <Router>
        <div>
          <Switch>
            <Route exact path='/' children={<Home dashboards={this.state.dashboards} />} />
            <Route exact path='/hostcomvizpage' children={<HostComVizPage />} />
            <Route exact path='/devdestress' children={<DevDestress />} />
          </Switch>
        </div>
      </Router>
    )
  }
}

const Home = ({ dashboards }) => {
  return (
    <div>
      <header> 
        <Navigation />
      </header>
      <SideBar dashboards={dashboards} />
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

const SideBar = ({ dashboards }) => {
  const dashboard_array = [];
  dashboards.forEach((board) => {
    dashboard_array.push (
      <div className='sidebar-links' key={board}>
        <img src="img/icon.jpg" alt='Dashboard logo' width='25px' height='25px' className='board-logo' />
        <h2 className='board-header'> {board} </h2>
      </div>
    )
  })
  return (
    <div className='row'> 
        <div className='side-col'>
          {dashboard_array}
          <div className='sidebar-links' key='DanTest'>
            <img src="img/icon.jpg" alt='Dashboard logo' width='25px' height='25px' className='board-logo' />
            <h2 className='board-header'> 
              <Link to="/hostcomvizpage">Test</Link>
            </h2>
          </div>

          <div className='sidebar-links' key='DanTest'>
            <img src="img/icon.jpg" alt='Dashboard logo' width='25px' height='25px' className='board-logo' />
            <h2 className='board-header'> 
              <Link to="/devdestress">DESTRESS</Link>
            </h2>
          </div>
      </div>
    </div>
  )
}

// class SideBar extends Component {
//   componentDidMount() {
//     console.log(this.props)
//     let dashboard_array = [];
//     for (let board of this.props.stat.dashboards) {
//       dashboard_array.push(
//         <div className='sidebar-links' key={board}>
//           <img src="img/icon.jpg" alt='Dashboard logo' width='25px' height='25px' className='board-logo' />
//           <h2 className='board-header'> {board} </h2>
//         </div>
//       )
//     }
//   }

//   render() {
//     return (
//       <div className='row'> 
//         <div className='side-col'>
//           {dashboard_array}
//         <div className='sidebar-links'>
//           <img src="img/dashboard-icon.jpg" />
//           Dashboard
//         </div>
//         <div className='sidebar-links'>
//           <Link to="/hostcomvizpage">test</Link>
//         </div>
//         <div className='body-col'>

//         </div>
//       </div>
//       </div>
//     )
//   }
// }

export default App;
