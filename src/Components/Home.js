import React, { Component } from 'react';
import Header from './Header'
import Footer from './Footer'
import Table from './Table'
import { withRouter } from 'react-router-dom'
import axios from 'axios'

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            action: 'open',
            tableHeaderData: ['Title', 'Employer', 'Skill', 'Avg Bid', 'Budget Range', 'Budget Period','No. of Bids'],
            tableRowData: []
        };
    }


    componentWillMount() {
        let getOpenProjects = 'http://localhost:3001/getOpenProjects';
        let id = localStorage.getItem('id');
        if (id) {
            var apiPayload = {
                id: id
            };
            axios.post(getOpenProjects, apiPayload)
                .then(res => {
                    if (res.data.errorMsg != '') {
                        this.setState({
                            errorMessage: res.data.errorMsg
                        });
                    } else if (res.data.successMsg != '') {
                        this.setState({           
                            tableRowData: res.data.data,
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

    onBackButtonEvent(e) {
        e.preventDefault();
        this.props.history.push('/home');
    }

    componentDidMount() {
        window.onpopstate = this.onBackButtonEvent.bind(this);

    }

    render() {
        return (
            <div>
                <Header />
                <div class="content-wrapper mt-1">
                    <div class="container-fluid">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item">
                                <a href="index.html">Home</a>
                            </li>
                            <li class="breadcrumb-item active">Open Projects</li>
                        </ol>
                        <div class="row mt-1 ml-3">
                            <div class="col-12">
                                <p></p>
                                <div class="col-lg-10">
                                    <div class="panel panel-default">
                                        <div class="panel-heading">

                                        </div>

                                        <div>
                                            <Table action={this.state.action} tableHeaderData={this.state.tableHeaderData} averageBid={this.state.averageBid} tableRowData={this.state.tableRowData} />

                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                   {<Footer />}                 </div>
            </div>

        );
    }
}
export default withRouter(Home);