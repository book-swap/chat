const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const User = require("./models/user.model");

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  issuer: "auth.bookswap",
  audience: "BookSwap"
};

module.exports = new JwtStrategy(opts, (jwtPayload, done) => {
  User.findById(jwtPayload.sub)
    .then(user => {
      if (!user) return done(null, false);
      return done(null, user);
    })
    .catch(err => done(err, false));
});
