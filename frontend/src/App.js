import React, {Component} from 'react';
import './App.css';
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';

import AuthPage from './components/auth';
import EventsPage from './components/events';
import BookingsPage from './components/bookings';
import MainNavigation from './components/navBar';
import CreateEvent from './components/createEvent';

import AuthContext from './context/auth-context';

class App extends Component {

  state = {
    token: null,
    userId: null
  }

  login = (token, userId) => {
    this.setState({
      token:token,
      userId: userId
    })
  }

  logout = () => {
    this.setState({
      token: null,
      userId: null
    })
  }

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider 
            value={{
              token: this.state.token, 
              userId: this.state.userId, 
              login: this.login, 
              logout: this.logout
            }}>
            <MainNavigation />
            <br/>
            <br/>
            <br/>

            <div className="container">
            <Switch>
                {this.state.token && <Redirect from="/" to="/events" exact />}
           
                {this.state.token && <Redirect from="/auth" to="/events" exact />}
           
                { !this.state.token && (
                  <Route path="/auth" component={AuthPage} />
                )}            
           
                <Route path="/events" component={EventsPage} />
                
                { this.state.token && (
                <Route path="/createEvent" component={CreateEvent} />
                )}
                
                { this.state.token &&  (
                  <Route path="/bookings" component={BookingsPage} />
                )}
                
                {!this.state.token && <Redirect  to="/auth" exact />}
           
            </Switch>
            </div>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
