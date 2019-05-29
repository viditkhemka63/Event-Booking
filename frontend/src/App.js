import React from 'react';
import './App.css';
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';

import AuthPage from './components/auth';
import EventsPage from './components/events';
import BookingsPage from './components/bookings';

function App() {
  return (
    <BrowserRouter>
      <Switch>
          <Redirect from="/" to="/auth" exact />
          <Route path="/auth" component={AuthPage} />
          <Route path="/events" component={EventsPage} />
          <Route path="/bookings" component={BookingsPage} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
