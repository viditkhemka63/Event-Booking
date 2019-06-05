import React,  {Component} from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../context/auth-context';
import './event.css';

class EventsPage extends Component {
    
    state = {
        events: []
    }

    componentDidMount(){
        this.fetchEvents();
    }

    bookEvent = (id) => {
        var requestBody = {
            query: `
            mutation {
                bookEvent(eventId: "${id}"){
                  _id
                  event{
                    title
                  }
                  user{
                    email
                  }
                }
              }
              
            `
        }
        const token = this.context.token;
        fetch('http://localhost:4000/graphql', {
            method: 'POST',
            body : JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        .then(res => {
            if(res.status !== 200 && res.status !== 201){
                alert('Booking already exists');
                throw new Error('Failed')
            }
            return res.json()
        })
        .then(resData => {
            alert('Event Successfully Booked');  
        })
        .catch(err => {
            console.log(err);
        });
    }

    fetchEvents = () => {
        var requestBody = {
            query: `
            query {
                events{
                  title
                  date
                  description
                  _id
                  price
                }
              }
            `
        }
        fetch('http://localhost:4000/graphql', {
            method: 'POST',
            body : JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(res => {
            if(res.status !== 200 && res.status !== 201){
                throw new Error('Failed');
            }
            return res.json()
        })
        .then(resData => {
            this.setState({
                events: resData.data.events
            });

            
        })
        .catch(err => {
            console.log(err);
        });
    }

    static contextType = AuthContext;

    render() {
        const eventList = this.state.events.map(event => {
            return (

                <a key={event._id} href="#" className="list list-group-item list-group-item-action flex-column align-items-start ">
                    <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1">{event.title}</h5>
                        {this.context.token && 
                            <button onClick={() => this.bookEvent(event._id)} className="btn btn-primary badge-pill">Book</button>
                        }
                    </div>
                    <p className="mb-1">{event.description}</p>
                    <small>{event.date}</small>
                </a>
            )
        })
        return (
            <div>
                {this.context.token && (<div className="text-center">
                    <NavLink to="/createEvent" className="btn btn-primary">Create your own Event</NavLink>
                </div>)}
                <h1>Event List</h1> 
                
                <div className="col-lg-8 col-centered">
                <div className="list-group">
                    {eventList}
                </div> 
                </div>             
            </div>
        );
    }
}

export default EventsPage;