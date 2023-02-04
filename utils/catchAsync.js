// Description: This file is used to catch errors in async functions.
module.exports = (fn) => (req, res, next) => {
  fn(req, res, next).catch((err) => next(err));
};
