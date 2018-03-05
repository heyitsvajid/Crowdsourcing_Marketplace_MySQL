import React, { Component } from 'react';



class CustomRow extends Component {
   
    handleClick = (e) => {
        e.preventDefault();
        localStorage.setItem('currentProjectId', e.target.id);
        window.location.href='http://localhost:3000/projectitem'
    }
    renderRows() {
        debugger;
        if (this.props.action === 'dashboard') {
            return (
                <tr>
                    <td><a  href='' id={this.props.rowData.id} onClick={this.handleClick} >{this.props.rowData.title}</a></td>
                    <td>{this.props.rowData.employee}</td>
                    <td>{this.props.rowData.average}</td>
                    <td>{this.props.rowData.mybid}</td>
                    <td>{this.props.rowData.status}</td>
                </tr>
            );
        } else if(this.props.action === 'open') {
            return (
                <tr>
                    <td><a  href='' id={this.props.rowData.id} onClick={this.handleClick} >{this.props.rowData.title}</a></td>
                    <td>{this.props.rowData.name}</td>
                    <td>{this.props.rowData.main_skill_id}</td>
                    <td>$ {this.props.rowData.average}</td>
                    <td>$ {this.props.rowData.budget_range}</td>
                    <td>{this.props.rowData.budget_period} Month</td>
                    <td>{this.props.rowData.count}</td>
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