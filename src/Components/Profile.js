import React, { Component } from 'react';
import Header from './Header'
import Footer from './Footer'
import ProfileForm from './ProfileForm'
import { withRouter } from 'react-router-dom'

class Profile extends Component {
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
                <Header /> <div class="content-wrapper mt-1">
                    <div class="container-fluid">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item">
                                <a href="index.html">Profile</a>    </li>
                            <li class="breadcrumb-item active">Update Profile Here</li>
                        </ol>
                        <div class="row mt-1 ml-3">
                            <div class="col-12">
                               
                                <div class="col-lg-10">
                                    <div class="panel panel-default">
                                       

                                        <div>
                                        <ProfileForm />
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
export default withRouter(Profile);