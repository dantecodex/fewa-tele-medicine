import fs from "fs"

const asyncErrorHandler = (requestHandler) => {
  return (req, res, next) => {
    return requestHandler(req, res, next).catch((err) => {
      if (req.file?.path) fs.unlinkSync(req.file?.path)
      next(err)
    })
  }
}

export default asyncErrorHandler
