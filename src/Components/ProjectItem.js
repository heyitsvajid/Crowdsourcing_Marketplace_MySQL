import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import '../assets/css/projectItem.css'
import Header from './Header'
import BidProjectForm from './BidProjectForm'
import ProjectBidDetail from './ProjectBidDetail'
import Footer from './Footer'
import axios from 'axios';

class ProjectItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            period: '',
            skill: '',
            description: '',
            budget: '',
            averageBid: '',
            attachment: '',
            bidNowButton: true,
            bidNowForrm: false
        };
    }

    componentWillMount() {
        debugger
        let getProjectAPI = 'http://localhost:3001/getProject';
        let id = localStorage.getItem('currentProjectId');
        let currentUserId = localStorage.getItem('id');
        if (id) {
            var apiPayload = {
                id: id,
                currentUserId: currentUserId
            };
            axios.post(getProjectAPI, apiPayload)
                .then(res => {
                    debugger
                    if (res.data.errorMsg != '') {
                        this.setState({
                            errorMessage: res.data.errorMsg
                        });
                    } else if (res.data.successMsg != '') {
                        this.setState({
                            title: res.data.data.title,
                            skill: res.data.data.skill,
                            description: res.data.data.description,
                            budget: res.data.data.budget,
                            period: res.data.data.period,
                            averageBid: 'Code Pending',
                            attachment: 'Code Pending',
                            bidNowButton: res.data.data.bidNowButton,
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

    handlebidNowButton() {
        this.setState({
            bidNowForm: !this.state.bidNowForm
        });
    }
    bidNowForm() {
        if (this.state.bidNowForm) {
            return (
                <BidProjectForm />
            );
        }
    }
    bidNow() {
        if (this.state.bidNowButton) {
            return (

                <button className="btn btn-lg btn-success" type="submit"
                    onClick={this.handlebidNowButton.bind(this)} >Bid Now</button>
            );
        } else {
            return (<button className="btn btn-lg btn-success">Bid Allready Submitted</button>);
        }
    }
    render() {
        return (

            <div class="container">
                <Header /><br/><br/><br/>
                <div>
                    <div class="content-wrapper">
                        <ol class="breadcrumb mt-2">
                            <li class="breadcrumb-item">
                                <a href="">Project</a>
                            </li>
                            <li class="breadcrumb-item active">Project Details</li>
                        </ol>
                    </div>
                    <div class='row'>

                        <div class='col md-6'>
                            <div class="row mt-3 ml-5">
                                <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 " >
                                    <div class="panel panel-info">
                                        <div class="row panel-heading">
                                            <h3 class="panel-title">{this.state.title}</h3>

                                            {this.bidNow()}
                                        </div>
                                        <div class="panel-body">
                                            <div class="row ">
                                                <div class=" col-md-9 col-lg-9 mt-4 ml-5" width="50%">
                                                    <table class="table table-user-information">
                                                        <tbody>
                                                            <tr>
                                                                <td>Skills</td>
                                                                <td>{this.state.skill}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Budget</td>
                                                                <td>$ {this.state.budget}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Period</td>
                                                                <td>{this.state.period} Month</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Average Bid</td>
                                                                <td>{this.state.average}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Attachment</td>
                                                                <td><a href="mailto:info@support.com">info@support.com</a></td>
                                                            </tr>
                                                            <tr>
                                                                <td>Description</td>
                                                                <td><textarea rows="5" cols='50' disabled value={this.state.description} ></textarea></td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div class='col md-6 mt-5' hide='true'>
                            {/* //https://stackoverflow.com/questions/24502898/show-or-hide-element */}
                            {this.bidNowForm()}
                        </div>

                    </div>
                    <hr />
                    <div>  <div class="content-wrapper">
                        <ol class="breadcrumb mt-2">
                            <li class="breadcrumb-item">
                                <a href="">Project</a>
                            </li>
                            <li class="breadcrumb-item active">Project Bids</li>
                        </ol>
                    </div>
                        <ProjectBidDetail />
                    </div>


                </div>
                <div class='mt-5' >
                    {<Footer />}
                </div></div>
        );
    }
}
export default withRouter(ProjectItem);