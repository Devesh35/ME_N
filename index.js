import dotenv from "dotenv";
import ServerBuilder from "./builders/base/Server.js";

dotenv.config();

const PORT = process.env.PORT

new ServerBuilder().defaultServer(PORT)

process.on("unhandledRejection", (err, promise) => console.log(`Error-ur: ${err.message}`));