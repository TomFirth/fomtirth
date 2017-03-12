import React, { Component } from 'react';

import Menu from 'components/Global/Menu';

export default class Home extends Component {
  render() {
    const { children } = this.props;

    return (
      <div className='Home'>
        <Menu />
        { children }
      </div>
    );
  }
}
