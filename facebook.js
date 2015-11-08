var passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:8000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

module.exports = {
  login: function() {
    return passport.authenticate('facebook');
  },
  onFailure: function() {
    return passport.authenticate('facebook', { failureRedirect: '/' });
  },
  initialize: function() {
    return passport.initialize();
  },
  session: function() {
    return passport.session();
  }
};