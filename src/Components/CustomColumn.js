import React, { Component } from 'react';
import Header from './Header'

class CustomColumn extends Component {

    render() {
        return (
            <td>{this.props.columnValue}</td>
        );
    }
}
export default CustomColumn;