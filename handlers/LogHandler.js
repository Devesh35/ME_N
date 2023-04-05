import dotenv from 'dotenv'
dotenv.config()

const logging = process.env.LOG == true

const logger = func => (req, res, next) => {
  if (logging) console.log(func?.(req, res, next) || "No Logger Defined")
  next()
}

export default logger