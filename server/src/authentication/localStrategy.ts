import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../models/user";
import { Role } from "./user";
import { local as config } from "../config";

const localStrategy = new LocalStrategy(async (username, password, done) => {
  const user = await User.findOne({ emailAddress: `${username}@htw-berlin.de` });
  if (!user || password !== config.password)
    return done(null, null, { message: "Invalid username or password" });
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
