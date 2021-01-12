const errorHandler = (err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    //   jwt auth error
    return res.status(401).json({ message: "The User is not Authorized" });
  }
  if (err.name === "ValidationError") {
    //   validation error
    return res.status(401).json({ message: err });
  }
  // General error
  return res.status(500).json(err);
};
