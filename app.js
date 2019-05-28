var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var graphqlHttp = require('express-graphql');
var { buildSchema } = require('graphql');
var mongoose = require('mongoose');
var Event = require('./models/event');
var User = require('./models/user');
var bcrypt = require('bcryptjs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//database connection
var dbUri = 'mongodb://admin:admin123@ds263146.mlab.com:63146/booking'
mongoose.connect(dbUri, (err) => {
  console.log('database connected');
})
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/graphql', graphqlHttp({
  schema: buildSchema(`
    type Event {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    type User {
      _id: ID!
      email: String!
      password: String
    }

    input EventInput{
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    input UserInput {
      email: String!
      password: String!
    }

    type RootQuery {
      events: [Event!]!
    }
    type RootMutation {
      createEvent(eventInput: EventInput): Event
      createUser(userInput: UserInput): User
    }
    schema {
      query:RootQuery
      mutation: RootMutation
    }
  `),
  rootValue: {
    events: () => {
      return Event.find({}).then(events => {
        return events.map(event => {
          return {...event._doc};
        })
      }).catch(err => {
        console.log(err);
      });
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
          returnEvent = {...re._doc};
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
      
     }
  },
  graphiql: true
}))
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
