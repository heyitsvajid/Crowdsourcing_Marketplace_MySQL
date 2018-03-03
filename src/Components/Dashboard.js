import React, { Component } from 'react';
import Header from './Header'
import Footer from './Footer'
import Table from './Table'
import { withRouter } from 'react-router-dom'

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableHeaderData: ['Name', 'Email'],
            tableRowData: [{ name: 'Vajid', email: 'Vajid9@gmail.com' },
            { name: 'Vajid', email: 'Vajid9@gmail.com' }]
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
                                <a href="index.html">Dashboard</a>
                            </li>
                            <li class="breadcrumb-item active">Bids Till Date</li>
                        </ol>
                        <div class="row mt-1 ml-3">
                            <div class="col-12">
                                {/* <h1>Blank</h1> */}
                                <p>This is an example of a blank page that you can use as a starting point for creating new ones.</p>
                                <div class="col-lg-10">
                                    <div class="panel panel-default">
                                        <div class="panel-heading">
                                            Striped Rows
                        </div>

                                        <div>
                                            <Table tableHeaderData={this.state.tableHeaderData} tableRowData={this.state.tableRowData} />

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
export default withRouter(Dashboard);