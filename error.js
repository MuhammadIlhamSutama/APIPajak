// error.js
function errorHandler(err, req, res, next) {
    console.error(err.stack); // Log the error for debugging
    res.status(500).json({ 
      error: err.message || "Something went wrong! Please try again later." 
    });
}
  
function notFoundHandler(req, res, next) {
    res.status(404).json({ error: "Route not found" });
  }
  
  module.exports = {
    errorHandler,
    notFoundHandler
};
  