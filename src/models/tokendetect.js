const mongoose = require("mongoose");

const tokenDetectSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    default: "",
  }
});

const TokenDetect = mongoose.model("TokenDetect", tokenDetectSchema);

module.exports = {
  TokenDetect
};
