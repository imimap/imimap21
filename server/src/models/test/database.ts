// based on tutorial at https://kimlehtinen.com/how-to-setup-jest-for-node-js-mongoose-typescript-projects/
import * as mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

const mongod = new MongoMemoryServer();

export const connect = async () => {
  const mongoDB = "mongodb://db:27017";
  try {
    await mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log(`Connection to database at ${mongoDB} successfully established.`);
  } catch (error) {
    console.error(`Connection to database at ${mongoDB} failed.`, error);
  }

  mongoose.connection.on("error", (error) => {
    console.error(`An error occurred with the database connection at ${mongoDB}.`, error);
  });
};

export const closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
};

export const clearDatabase = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};

export default connect;
