import React from 'react';
import ReactDOM from 'react-dom';
import LogIn from './Components/LogIn';
import SignUp from './Components/SignUp';
import Image from './Components/Image';
import Home from './Components/Home';
import Dashboard from './Components/Dashboard';
import ShoppingList from './Components/test';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './assets/css/bootstrap.min.css'
import './assets/css/bootstrap-responsive.min.css'



         
ReactDOM.render(
    <Router>
        <div>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={LogIn} />
          <Route exact path="/uploadImage" component={Image} />
          <Route exact path="/home" component={Dashboard} />
          <Route exact path="/signup" component={SignUp} />
        </div>
    </Router>,
    document.getElementById('root')
  )

 