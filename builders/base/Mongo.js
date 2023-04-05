import mongoose from 'mongoose'

class MongoBuilder {
  constructor(connectionURL = '') {
    this.mongoose = mongoose
    this.connectionURL = connectionURL
    this.mongoose.Promise = global.Promise
  }

  /**
   * @returns the reference of the class
   */
  get () { return this.mongoose }

  /**
   * If no object is passed, it return the url stored in the class
   * @param {Object?} mongo  
   * @returns a string formatted with the mongo object as `mongodb+srv://${mongo.username}:${mongo.password}@${mongo.cluster}.${mongo.host}/${mongo.db}?retryWrites=true&w=majority` 
   */
  getConnectionUrl (mongo) {
    return mongo ? `mongodb+srv://${mongo.username}:${mongo.password}@${mongo.cluster}.${mongo.host}/${mongo.db}?retryWrites=true&w=majority` : this.connectionURL
  }

  /**
   * Builds a connection url with the object and stores it in the object
   * connection url is formatted as `mongodb+srv://${mongo.username}:${mongo.password}@${mongo.cluster}.${mongo.host}/${mongo.db}?retryWrites=true&w=majority`
   * @param {Object} mongo 
   * @returns the reference of this class
   */
  buildConnectionUrl (mongo) {
    this.connectionURL = this.getConnectionUrl(mongo)
    return this
  }

  /**
   * if connection url (String) is passed it is used else the url stored in the class is used
   * if an Object is passed it is formatted to the mongodb connection url as 
   * `mongodb+srv://${connection.username}:${connection.password}@${connection.cluster}.${connection.host}/${connection.db}?retryWrites=true&w=majority`
   * 
   * @param {String? | Object?} connection 
   * @returns a Promise which resolve and connects to mongo db or throws the error
   */
  async connect (connection) {
    return this.mongoose
      .connect(typeof connection === 'object' ? this.getConnectionUrl(connection) : connection || this.connectionURL,
        {
          retryWrites: true,
          keepAlive: true,
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
      .then(() => console.log("Successfully connected to mongoDB"))
      .catch(err => {
        console.error({ message: `Mongo Connection Error: ${err.message}\n`, err })
        throw err;
      })
  }
}

export default MongoBuilder