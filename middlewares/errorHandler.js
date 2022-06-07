function errorHandler(err, req, res, next) {
  if (err) {
    return res.send({ message: err });
  }
}
module.exports = errorHandler;
