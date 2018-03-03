import React from 'react';
import ReactDOM from 'react-dom';
import LogIn from './Components/LogIn';
import SignUp from './Components/SignUp';
import Image from './Components/Image';
import Index from './Components/Index';
import Dashboard from './Components/Dashboard';
import ProjectItem from './Components/ProjectItem';
import Profile from './Components/Profile';
import PostProject from './Components/PostProject';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './assets/css/bootstrap.min.css'
import './assets/css/bootstrap-responsive.min.css'




ReactDOM.render(
  <Router>
    <div>
      <Route exact path="/projectitem" component={ProjectItem} />
      <Route exact path="/postproject" component={PostProject} />
      <Route exact path="/profile" component={Profile} />
      <Route exact path="/" component={Index} />
      <Route exact path="/dashboard" component={Dashboard} />
      <Route exact path="/login" component={LogIn} />
      <Route exact path="/uploadImage" component={Image} />
      <Route exact path="/home" component={Dashboard} />
      <Route exact path="/signup" component={SignUp} />
    </div>
  </Router>,
  document.getElementById('root')
)

