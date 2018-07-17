import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Header from './Header';
import Login from './Login';
import Homepage from './Homepage';
import Calendar from './Calendar';

class App extends Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <div>
            <Header />
            <Route exact path="/" component={Homepage} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/calendar" component={Calendar} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
