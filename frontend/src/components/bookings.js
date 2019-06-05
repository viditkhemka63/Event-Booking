import React,  {Component} from 'react';
import AuthContext from '../context/auth-context';

class BookingsPage extends Component {

    state = {
        bookings: []
    }

    componentDidMount() {
        this.fetchBookings();
    }
    
    cancelBooking = (id) => {

        var requestBody = {
            query: `
            mutation {
                cancelBooking(bookingId: "${id}"){
                  title
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
                throw new Error('Failed');
            }
            return res.json()
        })
        .then(resData => {
            alert(resData.data.cancelBooking.title + " is canceled");
            this.fetchBookings();
        })
        .catch(err => {
            console.log(err);
        });
    }

    fetchBookings = () => {
        var requestBody = {
            query: `
            query {
                bookings{
                _id    
                event {
                  title
                  description
                }
                user {
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
                throw new Error('Failed');
            }
            return res.json()
        })
        .then(resData => {
            this.setState({
                bookings: resData.data.bookings
            })
            
        })
        .catch(err => {
            console.log(err);
        });
    }

    static contextType = AuthContext;

    render() {
        const bookingList = this.state.bookings.map(booking => {
            if(localStorage.getItem("email") === booking.user.email) {
                return(
                    <a key={booking._id} href="#" className="list list-group-item list-group-item-action flex-column align-items-start ">
                        <div className="d-flex w-100 justify-content-between">
                            <h5 className="mb-1">{booking.event.title}</h5>
                            {this.context.token && 
                                <button onClick={() => this.cancelBooking(booking._id)} className="btn btn-danger badge-pill">Cancel</button>
                            }
                        </div>
                        <p className="mb-1">{booking.event.description}</p>
                    </a>
                )
            }
            return null;
        })
        return (
            <div>
                
                <h1>Booking List</h1> 
                
                <div className="col-lg-8 col-centered">
                <div className="list-group">
                    {bookingList}
                </div> 
                </div>             
            </div>
        );
    }
}

export default BookingsPage;