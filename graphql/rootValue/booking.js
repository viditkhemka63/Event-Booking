var Event = require('../../models/event');
var User = require('../../models/user');
var Booking = require('../../models/booking');

const transformEvent = event => {
  return {
    ...event._doc,
    date: new Date(event._doc.date).toISOString(),
    creator: user.bind(this, event._doc.creator)
  }
}

const transformBooking = booking => {
  return {
    ...booking._doc,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: new Date(booking._doc.createdAt).toISOString(),
    updatedAt: new Date(booking._doc.updatedAt).toISOString()
  }
}

const user = userId => {
    return User.findById(userId)
    .then(user => {
      return {
        ...user._doc,
        createdEvents: events.bind(this, user._doc.createdEvents)
      };
    }).catch(err => {
      throw err;
    });
  }
  
const events = eventIds => {
    return Event.find({_id: { $in: eventIds}})
    .then(events => {
      return events.map( event => {
        return transformEvent(event);
      })
    })
    .catch(err => {
      throw err;
    });
  }

const singleEvent = async eventId => {
  try {
    const event = await Event.findById(eventId);

    return transformEvent(event);
  } catch (error) {
    throw error;
  }
}

module.exports = {
    
    bookings: async () => {
      try {
        const bookings = await Booking.find();
        return bookings.map(booking => {
           return transformBooking(booking);
        })
      } catch (error) {
        throw error;
      }
    },
    bookEvent: async args => {
       const fetchEvent = await Event.findById(args.eventId);
       console.log(fetchEvent);
       const booking = new Booking({
         user: '5ced4faae3ee4419899865e4',
         event: fetchEvent
       })

       const result = await booking.save();
       return transformBooking(result);
     }, 
    cancelBooking: async args =>{
       try {
        const booking = await Booking.findById(args.bookingId).populate('event');
        console.log(booking);
        const event = transformEvent(booking.event);
        await Booking.deleteOne({_id: args.bookingId});
        return event;

       } catch (error) {
         throw error;
       }
     } 

  }