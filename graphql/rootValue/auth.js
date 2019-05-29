var Event = require('../../models/event');
var User = require('../../models/user');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

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

module.exports = {
        
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
    login: async ({email, password}) => {
        const user = await User.findOne({email: email});
        if(!user) {
            throw new Error('user does not exists');
        }

        const isEqual = await bcrypt.compare(password, user.password);
        if(!isEqual){
            throw new Error('user password is incorrect');
        }
        const token = jwt.sign({userId: user._id, email: user.email}, 'root', {
            expiresIn: '1h'
        });
        return {
            userId: user._id,
            token: token,
            tokenExpiration: 1
        };
    }
  }