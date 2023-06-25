import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../models/user";
import { Role } from "./user";
import { local as config } from "../config";

const localStrategy = new LocalStrategy(async (username, password, done) => {
  let user = await User.findOne({ emailAddress: `${username}@htw-berlin.de` });
  if (!user){
    if(password !== config.password || !username.startsWith("s05")) return done(null, null, { message: "Invalid username or password" });
    // DS allow creation of new s05xxxx user, if email is no foubnd in local strategy
    // DS for testing new user creation , if the right password is given
    return done(null, {
      id: username,
      firstName: "Peter",
      lastName: "Pan",
      email: `${username}@htw-berlin.de`,
      role: Role.STUDENT,
    });
} 
  return done(null, {
    id: user.studentProfile?.studentId ?? "admin",
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.emailAddress,
    role: user.isAdmin ? Role.INSTRUCTOR : Role.STUDENT,
  });
});

localStrategy.name = config.strategyName;

export default localStrategy;
