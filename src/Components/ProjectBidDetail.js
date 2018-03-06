import React, { Component } from 'react';
import axios from 'axios'

class ProjectBidDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectBids: [],
    }
  }
  componentWillMount() {
    debugger
    let getBidsAPI = 'http://localhost:3001/getBids';
    let id = localStorage.getItem('currentProjectId');
    let currentUserId = localStorage.getItem('id');
    if (id) {
      var apiPayload = {
        id: id,
        currentUserId:currentUserId
      };
      axios.post(getBidsAPI, apiPayload)
        .then(res => {
          debugger
          if (res.data.errorMsg != '') {
            this.setState({
              errorMessage: res.data.errorMsg
            });
          } else if (res.data.successMsg != '') {
            this.setState({
              projectBids: res.data.data
            });

          } else {
            this.setState({
              errorMessage: 'Unknown error occurred'
            });
          }
        })
        .catch(err => {
          console.error(err);
        });
    }
  }
  render() {

    let projectBids = this.state.projectBids.map(bid => {
      return (
        <div>
        <div class="card flex-md-row mb-8 box-shadow h-md-300">
          <div class="card-body d-flex flex-column align-items-start ">
           <h3> <strong class="d-inline-block mb-1 text-primary">{bid.name}</strong></h3>
 
            <div class="mb-1"><h5>Days : {bid.bid_period}</h5></div>
            <p class="card-text mb-auto"><h5>Amount : {bid.bid_amount}</h5></p>
            <a ><button type="button" class="btn btn-primary">Hire {bid.name}</button></a>
          </div>
          <img class="card-img-right flex-auto d-none d-md-block" alt="Thumbnail [200x250]"
            width='200px' height='200px'
            src={require('../assets/freelancer_32_32.png')} data-holder-rendered="true" />
      
        </div><br/></div>)
    })
    return (
      <div class="col-md-8 mt-5">
{projectBids}
      </div>

    );
  }
}
export default ProjectBidDetail;