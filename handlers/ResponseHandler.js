import dotenv from 'dotenv'
dotenv.config()

// ----------RESOPONDERS----------

const logging = (process.env.LOG_ITEMS || "").split(",").includes("responder")

export const response = (res, status = 500, message, data = {}, log = logging) => {
  if (log) console.log({ status, message, data });
  if (!res) return;
  if (res.responseSent) return console.log("Request Response Error: Response already sent to this request", { status, message, data })
  res.status(status).send({ status, message, data })
  res.responseSent = true;
}

export const resp = (res, { key = 'data', success = "Request Executed Successfully", fail = "An Error Occurred", unimplemented = false } = {}) => {
  if (!res) return console.log("No Response Object")
  try {
    if (unimplemented) return response(res, 404)
    if (res.err) return response(res, res.errCode || 400, res.err || fail, res.errData)
    return response(res, res.successCode || 200, res.success || success, res[key])
  } catch (e) {
    console.log(e)
    response(res, 500, e.message || "Invalid Error")
  }
}

export const def = (options = {}) => (_, res) => resp(res, options)
