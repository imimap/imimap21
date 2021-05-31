// based on tutorial at https://kimlehtinen.com/how-to-setup-jest-for-node-js-mongoose-typescript-projects/
import * as mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

const mongod = new MongoMemoryServer();

export const connect = async () => {
  const uri = await mongod.getUri();
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log(`Connection to test database at ${uri} successfully established.`);
  } catch (error) {
    console.error(`Connection to test database at ${uri} failed.`, error);
  }

  mongoose.connection.on("error", (error) => {
    console.error(`An error occurred with the test database connection at ${uri}.`, error);
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
