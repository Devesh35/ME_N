import dotenv from 'dotenv'
dotenv.config()

const logging = process.env.LOG == true

const logger = func => (req, res, next) => {
  if (logging) console.log(func?.(req, res, next) || "No Logger Defined")
  next()
}

export const logRequest = req => ({
  path: req.path,
  body: req.body,
  query: req.query,
  params: req.params,
})

export default logger