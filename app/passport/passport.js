var FacebookStrategy = require('passport-facebook').Strategy;
var user = require("../models/user");
var session = require('express-session');


module.exports = function(app,passport){
    
    
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }
    }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
    
    passport.use(new FacebookStrategy({
        clientID: '256406918486873',
        clientSecret: '6cd4f17935f83fcf63d3bb78cc523777',
        callbackURL: "http://localhost:8080/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'photos', 'email']
      },
      function(accessToken, refreshToken, profile, done) {
        /*User.findOrCreate(..., function(err, user) {
          if (err) { return done(err); }
          done(null, user);
        });*/
        console.log(profile);
        done(null, profile);
      }
    ));

    //app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }));

app.get('/auth/facebook',
  passport.authenticate('facebook', { scope: 'email' })
);
    
    return passport;
}


