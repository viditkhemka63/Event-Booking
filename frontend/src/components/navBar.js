import React from 'react';
import { NavLink } from 'react-router-dom';

import AuthContext from '../context/auth-context';

const MainNavigation = props => (
    <AuthContext.Consumer>
        {
            (context) => {
                return(
                    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
                    <a className="navbar-brand" href="#">Event Booking </a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
            
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                        { !context.token &&<li className="nav-item">
                            <NavLink to="/auth" className="nav-link">Authorization</NavLink>
                        </li>}
                        <li className="nav-item">
                            <NavLink to="/events" className="nav-link">Events</NavLink>
                        </li>

                        { context.token && <li className="nav-item">
                            <NavLink to="/bookings" className="nav-link">Bookings</NavLink>
                        </li>}
                        
                        </ul>
                        {context.token && <button onClick={context.logout} className="btn btn-outline-success my-2 my-sm-0">Logout</button>}

                    </div>
                </nav>
                );
            }
        }
    </AuthContext.Consumer>
    
);

export default MainNavigation;