import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import RepoList from './RepoList';
import Walmart from './Walmart';
import UserList from './UserList';
import { Route, NavLink , Switch, Redirect } from 'react-router-dom';

const About = () => (
  <ul className="about-page">
    <li> Walmart online search helper </li>
    <li> written by Josh Yu with react.js library </li>
    <li> version 0.1 </li>
  </ul>
)

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>

        <div className="main">
            <ul className="link-container hor-clickable-list">
                <li> <NavLink to="/Walmart/ketchup" activeClassName="active"> walmart search </NavLink> </li>
                <li> <NavLink to="/Repos/javascript" activeClassName="active"> github Repo </NavLink></li>
                <li> <NavLink to="/UserList" activeClassName="active"> User List </NavLink></li>
                <li> <NavLink to="/about" activeClassName="active"> about me </NavLink> </li>
            </ul>

            <div className="main-content-container">
              <Switch>
                <Route path="/Walmart/:search" component={Walmart} />
                <Route path="/about" component={About} />
                <Route path="/Repos/:search" component={RepoList} />
                <Route path="/UserList" component={UserList} />
                <Redirect exact from="" to="/Walmart/ketchup"/>
              </Switch>
            </div>
        </div>
      </div>
    );
  }
}

export default App;
