import React, { Component } from 'react';
import { Link } from 'react-router';

export default class App extends Component {
  render() {
    const { children } = this.props;

    return (
      <div className='App'>
        <Link to='/'>Home</Link>
        <Link to='/blog'>Blog</Link>
        <Link to='/files'>Files</Link>

        { children }
      </div>
    );
  }
}