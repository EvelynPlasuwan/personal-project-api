// const handleErrors = (err, req, res, next) => {
//     res
//       .status(err.statusCode || 500)
//       .json({ message: err.message || "Something wrong!!" });
//   };
//   module.exports = handleErrors;

// back-end/middlewares/error.js
const handleErrors = (err, req, res, next) => {
  console.error(err); // Log error for debugging
  res.status(err.statusCode || 500).json({ 
      message: err.message || "Internal server error",
      error: process.env.NODE_ENV === 'development' ? err : {}
  });
};

module.exports = handleErrors;