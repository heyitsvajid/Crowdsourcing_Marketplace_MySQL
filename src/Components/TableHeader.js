import React, { Component } from 'react';
import '../assets/css/bootstrap.css'


class TableHeader extends Component {
  render() {
    return (
            <th className='tableHeader' >{this.props.tableHeaderValue}</th>
          );
  }
}
export default TableHeader;