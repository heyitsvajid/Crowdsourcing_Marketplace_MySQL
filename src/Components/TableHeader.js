import React, { Component } from 'react';

class TableHeader extends Component {
  render() {
    return (
            <th>{this.props.tableHeaderValue}</th>
          );
  }
}
export default TableHeader;