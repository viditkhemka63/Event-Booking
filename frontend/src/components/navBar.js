import React from 'react';
import { NavLink } from 'react-router-dom';

const MainNavigation = props => (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">Navbar</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
            <li className="nav-item">
                <NavLink to="/auth" className="nav-link">Authorization</NavLink>
            </li>
            <li className="nav-item">
                <NavLink to="/events" className="nav-link">Events</NavLink>
            </li>
            <li className="nav-item">
                <NavLink to="/bookings" className="nav-link">Bookings</NavLink>
            </li>
            
            </ul>
        </div>
    </nav>
);

export default MainNavigation;