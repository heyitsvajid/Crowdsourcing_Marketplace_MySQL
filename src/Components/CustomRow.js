import React, { Component } from 'react';



class CustomRow extends Component {
    renderRows() {
        debugger;
        if (this.props.action === 'dashboard') {
            return (
                <tr>
                    <td>{this.props.rowData.title}</td>
                    <td>{this.props.rowData.employee}</td>
                    <td>{this.props.averageBid}</td>
                    <td>{this.props.rowData.mybid}</td>
                    <td>{this.props.rowData.status}</td>
                </tr>
            );
        } else {
            return (
                <tr>
                    <td>{this.props.rowData.title}</td>
                    <td>{this.props.rowData.skill}</td>
                    <td>{this.props.rowData.budget}</td>
                    <td>{this.props.averageBid}</td>
                </tr>
            );
        }
    }
    render() {

        return (

            <tbody>
                {this.renderRows()}
            </tbody>
        );
    }
}
export default CustomRow;