import React, { Component } from 'react';
import { Link } from 'react-router';

export default class Menu extends Component {
  render() {
    return (
      <div className='Menu'>
        <Link to='/'>Home</Link>
        <Link to='/blog'>Blog</Link>
        <Link to='/files'>Files</Link>
        <Link to='/support'>Support</Link>
        <hr />
      </div>
    );
  }
}
