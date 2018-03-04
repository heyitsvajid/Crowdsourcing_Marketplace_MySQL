import React, { Component } from 'react';
import Header from './Header'
import Footer from './Footer'
import Table from './Table'
import { withRouter } from 'react-router-dom'

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            action: 'open',
            averageBid: '1000',
            tableHeaderData: ['Title', 'Employer', 'Avg Bid', 'Your Bid', 'Status'],
            tableRowData: [{ budget: 'Vajid', email: 'Vajid9@gmail.com' },
            { budget: 'Vajid', email: 'Vajid9@gmail.com' }]
        };
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

                    <Footer />                </div>
            </div>

        );
    }
}
export default withRouter(Home);