import React from 'react'
import ReactDOM from 'react-dom'

import Menu from './components/public/menu.jsx'
import App from './views/App'
import Home from './views/Home'
import Blog from './views/Blog'
import Files from './views/Files'

import { Router, Route, IndexRoute, browserHistory } from 'react-router'

ReactDOM.render(
  <Router history={ browserHistory }>
    <Route path='/' component={ App }>
      <IndexRoute component={ Home } />
      <Route path='blog' component={ Blog } />
      <Route path='files' component={ Files } />
    </Route>
  </Router>,
  document.getElementById('app')
)
