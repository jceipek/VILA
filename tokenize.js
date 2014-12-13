var D = require('./data');
var VerEx = require("verbal-expressions");
var Lexer = require("lex");

var T = {
  PLUS: function () { return {token: "T_PLUS"}; }
, MINUS: function () { return {token: "T_MINUS"}; }
, DIV: function () { return {token: "T_DIV"}; }
, MUL: function () { return {token: "T_MUL"}; }
, INT: function (n) { return {token: "T_INT", value: parseInt(n)}; }
, RPAREN: function () { return {token: "T_RPAREN"} }
, LPAREN: function () { return {token: "T_LPAREN"} }
}

var tokenize = function (str) {
  var expression = VerEx().find( "+" );
  var result = str.split( expression ); // TODO: Switch to using Lex
  console.log(result);
  return D.makeASTExpression([result],'+');
}

module.exports = {
  tokenize: tokenize
}