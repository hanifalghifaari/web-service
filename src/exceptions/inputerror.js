const Clientrror = require("./clienterror")

class InputError extends Error {
    constructor(message) {
      super(message);
      this.statusCode = 400;
    }
  }
  
  module.exports = InputError;
  