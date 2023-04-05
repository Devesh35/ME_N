import dotenv from "dotenv";
import ServerBuilder from "./builders/base/Server.js";
import MongoBuilder from "./builders/base/Mongo.js";

dotenv.config();

const PORT = process.env.PORT
const MONGO_URL = process.env.MONGO_CONNECTION_URL

new MongoBuilder()
  .connect(MONGO_URL)
  .then(() =>
    new ServerBuilder()
      .defaultServer(PORT)
  ).catch(err => console.error({ message: `Server Start Error: ${err.message}\n`, err, }))

process.on("unhandledRejection", (err, promise) => console.log(`Error-ur: ${err.message}`));