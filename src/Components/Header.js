import React, { Component } from 'react';
import '../assets/css/header.css'
import { Link } from 'react-router-dom';


// create class
class Header extends Component {

//<img className="logo" src="https://cdn6.f-cdn.com/build/icons/fl-logo.svg" alt="" height="40" width="170" />
  //<a className="brand" href="#">freelancer</a>
  //<img className="mb-4" src={require('../assets/freelancer_32_32.png')} alt="" height="30" width="30"/>
  render() {
    return (
      <header>
        <nav className="nav dark-nav">
          <div className="container">
            <div className="nav-heading">
            <img className="logo" src="https://cdn6.f-cdn.com/build/icons/fl-logo.svg" alt="" height="40" width="170" />
            </div>
            <div className="menu" id="open-navbar1">
              <ul className="list">
                <li><a href="#">My Projects</a></li>
                <li className="categories"><a href="#" id="open-categories" data-dropdown="target" href="#">Categories <i className="fa fa-caret-down"></i></a>
                  <ul className="drop-down" id="target">
                    <li><a href="#">Actions</a></li>
                    <li><a href="#">Something else here</a></li>
                    <li className="sub-drop-down"><a href="#">Another dropdown menu</a>
                      <ul className="sub-dropdown">
                        <li><a href="#">Action</a></li>
                        <li><a href="#">Another action</a></li>
                        <li><a href="#">One more</a></li>
                        <li className="speprator"></li>
                        <li><a href="#">Somthething else here</a></li>
                      </ul>
                    </li>
                    <li className="seprator"></li>
                    <li><a href="#">Seprated link</a></li>
                    <li className="seprator"></li>
                    <li><a href="#">One more seprated link.</a></li>
                  </ul>
                </li>
                <li><a href="#">Search Projects</a></li>
                <button type="button" class="btn btn-primary mt-2">Post Project</button>
                <li><a href="#">Profile</a></li>
                <li><a href="#">Logout</a></li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

    );
  }

}


export default Header;
