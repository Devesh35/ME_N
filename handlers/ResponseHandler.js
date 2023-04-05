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

export const responders = {
  response,
}