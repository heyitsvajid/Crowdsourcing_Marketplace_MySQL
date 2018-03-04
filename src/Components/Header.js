import React, { Component } from 'react';
import '../assets/css/header.css'
import '../assets/css/dropdown.css'
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
                <li><Link to='/home'><a >Home</a></Link ></li>
                <li ><Link to='/dashboard'><a >Dashboard</a></Link></li>
                <li ><Link to='/myprojects'><a >My Projects</a></Link></li>
                <li>    <Link to="/postproject">  <button type="button" class="btn btn-primary">Post Project</button></Link>
</li>
                <li class="dropdown mr-2">
                  <a data-toggle="dropdown" class="dropdown-toggle"><img className="mr-2" src={require('../assets/freelancer_32_32.png')} alt="" height="30" width="30" /> <b class="caret"></b></a>
                  <ul class="dropdown-menu" >
                    <Link to="/profile">  <li><a >Profile</a></li></Link>
                    <Link to="/"> <li><a >Logout</a></li></Link>
                    <li class="divider"></li>
                  </ul>
                </li>
            
              </ul>
            </div>
          </div>
        </nav>
      </header>

    );
  }

}


export default Header;
