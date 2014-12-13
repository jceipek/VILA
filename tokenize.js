var D = require('./data');
var VerEx = require("verbal-expressions");
var Lexer = new (require("./lexer"));

var tokenize = function (str) {
  Lexer.input(str);
  var currToken;
  var tokens = [];
  try {
    do {
        currToken = Lexer.token();
        tokens.push(currToken);
    } while (currToken != null);
  } catch (e) {

  }
  return tokens;
}

module.exports = {
  tokenize: tokenize
}