import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import App from 'views/App';
import Home from 'views/Home';
import Blog from 'views/Blog';
import Files from 'views/Files';
import Support from 'views/Support';
import notFound from 'views/notFound';

ReactDOM.render(
  <Router history={ browserHistory }>
    <Route path='/' component={ App }>
      <IndexRoute component={ Home } />
      <Route path='blog' component={ Blog } />
      <Route path='files' component={ Files } />
      <Route path='support' component={ Support } />
      <Route path='*' component={ notFound } />
    </Route>
  </Router>,
  document.getElementById('app')
);
