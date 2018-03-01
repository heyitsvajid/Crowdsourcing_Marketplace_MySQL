import React, { Component } from 'react';
import Header from './Header'
import {withRouter} from 'react-router-dom'

class ShoppingList extends Component {
  


    render() {
      return (
       
       <div>
     <Header/>
       <div className="shopping-list">
          <h1>Shopping List for {this.props.name}</h1>
          <ul>
            <li>Instagram</li>
            <li>WhatsApp</li>
            <li>Oculus</li>
          </ul>
        </div>
        </div>
     
      );
    }
  }
export default withRouter(ShoppingList);