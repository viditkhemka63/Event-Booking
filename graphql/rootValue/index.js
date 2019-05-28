var Event = require('../../models/event');
var User = require('../../models/user');
var bcrypt = require('bcryptjs');
var Booking = require('../../models/booking');

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
        return {
          ...event._doc,
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, event._doc.creator)
        }
      })
    })
    .catch(err => {
      throw err;
    });
  }

const singleEvent = async eventId => {
  try {
    const event = await Event.findById(eventId);

    return {
      ...event._doc,
      creator: user.bind(this, event._doc.creator)
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
    events: () => {
      return Event.find()
      .then(events => {
        return events.map(event => {
          return {
            ...event._doc,
            date: new Date(event._doc.date).toISOString(),
            creator:user.bind(this, event._doc.creator)
          };
        })
      }).catch(err => {
        console.log(err);
      });
    },
    bookings: async () => {
      try {
        const bookings = await Booking.find();
        return bookings.map(booking => {
          return {
            ...booking._doc,
            user: user.bind(this, booking._doc.user),
            event: singleEvent.bind(this, booking._doc.event),
            createdAt: new Date(booking._doc.createdAt).toISOString(),
            updatedAt: new Date(booking._doc.updatedAt).toISOString()
          }
        })
      } catch (error) {
        throw error;
      }
    },
    createEvent: (args) => {
      var returnEvent = null;
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: args.eventInput.price,
          date: new Date(args.eventInput.date),
          creator: '5ced4faae3ee4419899865e4'
        });
        return event.save()
        .then(re => {
          console.log(re);
          returnEvent = {
            ...re._doc, 
            date: new Date(event._doc.date).toISOString(),
            creator: user.bind(this, re._doc.creator)
          };
          return User.findById('5ced4faae3ee4419899865e4')
          
        })
        .then(user => {
          console.log(user);
          if(!user) {
            throw new Error('user not found');
          }
          user.createdEvents.push(event)
          return user.save();
        })
        .then(result => {
          return returnEvent;
        })
        .catch(err => {
          console.log(err);
        });
    },
     createUser: args => {
       return User.find({email: args.userInput.email}).then(user => {
         console.log(user);
         if(user.email){
           throw new Error('user already exists');
         }
         return bcrypt.hash(args.userInput.password, 12)
       })
      .then(hash => {
          var user = new User({
            email: args.userInput.email,
            password: hash
          })

         return user.save()
       }).then(result => {
         return {...result._doc, password: null};
       })
       .catch(err => {
         throw err;
       });
      
     },
     bookEvent: async args => {
       const fetchEvent = await Event.findById(args.eventId);
       console.log(fetchEvent);
       const booking = new Booking({
         user: '5ced4faae3ee4419899865e4',
         event: fetchEvent
       })

       const result = await booking.save();
       return {
        ...result._doc,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: new Date(result._doc.createdAt).toISOString(),
        updatedAt: new Date(result._doc.updatedAt).toISOString()
       }
     }, 
     cancelBooking: async args =>{
       try {
        const booking = await Booking.findById(args.bookingId).populate('event');
        console.log(booking);
        const event = {
          ...booking.event._doc,
          creator: user.bind(this, booking.event._doc.creator)
        }
        await Booking.deleteOne({_id: args.bookingId});
        return event;

       } catch (error) {
         throw error;
       }
     } 
  }