import { ExtractJwt } from 'passport-jwt'
import { Users } from '../api/users'
import configKey from '../config'
import bcrypt from 'bcrypt-nodejs'


const passport = require("passport");
const LocalStrategy = require("passport-local");
const JwtStrategy = require("passport-jwt").Strategy;

const localOptions = {
    usernameField: "email"
};

const localLogin = new LocalStrategy(
    localOptions,
    async (email, password, done) => {
        try {
            const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            const mobileNoRegexp = /\(?\d{3}\)?-? *\d{3}-? *-?\d{6}/;
            if (emailRegexp.test(email)) {
                const userExistence = await Users.findOne({ emailId: email.toLowerCase() })
                if (!userExistence) {
                    return done("Either Password or EmailId Doesn't match", false);
                }
                const validPassword = await bcrypt.compareSync(password, userExistence.password);
                if (!validPassword) {
                    return done("Password is Incorrect Please try Again later", false);
                }
                return done(null, userExistence);
            }
            else if (mobileNoRegexp.test(email)) {
                const userExistence = await Users.findOne({ mobileNo: email })
                if (!userExistence) {
                    return done("Either Password or EmailId Doesn't match", false);
                }
                const validPassword = await bcrypt.compareSync(password, userExistence.password);
                if (!validPassword) {
                    return done("Password is Incorrect Please try Again later", false);
                }
                return done(null, userExistence);
            }
        }
        catch (err) {
            return done("System was unable to process the details", false);
        }
    }
)

passport.use(localLogin);

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader("authorization"),
    secretOrKey: configKey.secrets.JWT_SECRET
}

const jwtLogin = new JwtStrategy(jwtOptions, (jwt_payload, done) => {
    Users.findOne({ emailId: jwt_payload.sub },
        (err, user) => {
            if (err) {
                return done(err.message, false);
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        })
})
passport.use(jwtLogin);
