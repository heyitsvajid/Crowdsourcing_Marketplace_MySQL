import React, { Component } from 'react';
import Header from './Header'
import { withRouter } from 'react-router-dom'

class Dashboard extends Component {
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
                       
                        <div class="panel-body">
                            <div class="table-responsive">
                                <table class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>First Name</th>
                                            <th>Last Name</th>
                                            <th>Username</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td>Mark</td>
                                            <td>Otto</td>
                                            <td>@mdo</td>
                                        </tr>
                                        <tr>
                                            <td>2</td>
                                            <td>Jacob</td>
                                            <td>Thornton</td>
                                            <td>@fat</td>
                                        </tr>
                                        <tr>
                                            <td>3</td>
                                            <td>Larry</td>
                                            <td>the Bird</td>
                                            <td>@twitter</td>
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

                    <footer class="sticky-footer">
                        <div class="container mt-5">
                            <div class="text-center">
                                <small>Copyright © Your Website 2018</small>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>

        );
    }
}
export default withRouter(Dashboard);