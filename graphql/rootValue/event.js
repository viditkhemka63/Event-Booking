var Event = require('../../models/event');
var User = require('../../models/user');

const transformEvent = event => {
  return {
    ...event._doc,
    date: new Date(event._doc.date).toISOString(),
    creator: user.bind(this, event._doc.creator)
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
    events: () => {
      return Event.find()
      .then(events => {
        return events.map(event => {
          return transformEvent(event);
        })
      }).catch(err => {
        console.log(err);
      });
    },
    createEvent: (args, req) => {
      if(!req.isAuth){
        throw new Error('not authenticated');
      }
      var returnEvent = null;
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: args.eventInput.price,
          date: new Date(args.eventInput.date),
          creator: req.userId
        });
        return event.save()
        .then(re => {
          console.log(re);
          returnEvent = transformEvent(re)  ;
          return User.findById(req.userId)
          
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
  }