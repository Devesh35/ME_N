import express from 'express'
import cors from 'cors'

import errorHandler from '../../handlers/ErrorHandler.js';
import { response } from '../../handlers/ResponseHandler.js';

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
      .usePlugin(ExpressPlugins.resourceNotFound)
  }

  initialize () {
    return this.usePlugin(cors())
      .usePlugin(express.json({ limit: "50mb" }))
      .usePlugin(express.urlencoded({ limit: "50mb", extended: true }))
      .usePlugin(ExpressPlugins.setResponseHeaders)
      .usePlugin(ExpressPlugins.logRequest)
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
    this.buildServer().listen(PORT, () => console.log(`Server is running on port ${PORT}.`))
    return this.server
  }

  defaultServer (PORT) {
    return this.initialize().finalize().buildAndListen(PORT)
  }
}

export default ServerBuilder;

class ExpressPlugins {
  static setResponseHeaders (_, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  }

  static logRequest (req, _) {
    return {
      path: req.path,
      body: req.body,
      query: req.query,
      params: req.params,
    }
  }

  static resourceNotFound (_, res) {
    response(res, 404, "Unable to find the requested resource", { success: false })
  }
}