import * as mongoose from "mongoose";

let dbConnection: mongoose.Mongoose | null = null;

async function connect(): Promise<void> {
  const mongoDB = "mongodb://db:27017/imimap";
  try {
    dbConnection = await mongoose.connect(mongoDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log(`Connection to database at ${mongoDB} successfully established.`);
  } catch (error) {
    console.error(`Connection to database at ${mongoDB} failed.`, error);
  }

  mongoose.connection.on("error", (error) => {
    console.error(`An error occurred with the database connection at ${mongoDB}.`, error);
  });
}

async function disconnect(): Promise<void> {
  if (dbConnection !== null && dbConnection) await dbConnection.disconnect();
}

export default { connect, disconnect };
