import { def } from "./ResponseHandler.js"

const onErrorDefault = (req, res) => e => {
  res.errCode = e.statusCode
  res.err = e.message
  res.errData = e.data
  console.log("Error: ", e)
  def()(req, res)
}

// If data is passed to next, It throws an error. Hence return undefined if no error occurred
export const syncHandler = (func = (() => { }), err = onErrorDefault) => (req, res, next) =>
  Promise.resolve(func(req, res)).then(next).catch((err(req, res, next)))

// If data is passed to next, It throws an error. Hence return undefined if no error occurred
export const asyncHandler = (func = (async () => { }), err = onErrorDefault) => (req, res, next) =>
  Promise.resolve(func(req, res).then(next).catch(err(req, res, next)))

export const funcToPromise = (func = async () => { }, args = []) => Promise.resolve(func(...args))
