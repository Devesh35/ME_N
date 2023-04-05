import express from 'express'
import cors from 'cors'

import errorHandler from '../../handlers/ErrorHandler.js';
import { response } from '../../handlers/ResponseHandler.js';
import logger, { logRequest } from '../../handlers/LogHandler.js';

class ServerBuilder {
  constructor(server) {
    this.server = server || express();
  }

  useMethod (method, worker, ...handlers) {
    this.server?.[method]?.(worker, ...handlers)
    return this
  }

  usePlugin (plugin) {
    return this.useMethod('use', plugin)
  }

  addRoute (method, route, ...handlers) {
    return this.useMethod(method, route, ...handlers)
  }

  handleErrors () {
    return this.usePlugin(errorHandler)
      .usePlugin((req, res, next) => response(res, 404, "Unable to find the requested resource", { success: false }))
  }

  initialize () {
    return this.usePlugin(cors())
      .usePlugin(express.json({ limit: "50mb" }))
      .usePlugin(express.urlencoded({ limit: "50mb", extended: true }))
      .usePlugin(logger(logRequest))
      .addRoute('get', '/health', (req, res) => response(res, 200, "OK"))
  }

  finalize () {
    return this.addRoute('get', '/', (req, res) => response(res, 200, "API is Running..."))
      .handleErrors()
  }

  buildServer () {
    return this.server
  }

  buildAndListen (PORT) {
    return this.buildServer().listen(PORT, () => console.log(`Server is running on port ${PORT}.`))
  }

  defaultServer (PORT) {
    return this.initialize().finalize().buildAndListen(PORT)
  }
}

export default ServerBuilder;