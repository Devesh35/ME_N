import dotenv from "dotenv";
import express from "express";

dotenv.config();

const PORT = process.env.PORT

const server = express()

server.listen(PORT, () => console.log(`Server running on port: ${PORT}`))